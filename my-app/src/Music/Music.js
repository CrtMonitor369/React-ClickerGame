import * as Tone from "tone";

/*
Algorithmic background music.

1. The seed comes from the mouse position and the current time (see initMusic).
2. The seed feeds a small pseudo random number generator, so the same seed always gives the same song.
3. compose() uses that generator to pick a key, a scale, a tempo, a chord progression and a melody.
4. startMusic() plays the result with a few Tone.js synths, looping an 8 bar piece.
*/


// ---------- Seeding ----------

// Turns any string into a 32 bit number (xmur3 style hash)
function hashString(str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
        h = (h << 13) | (h >>> 19);
    }
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^ (h >>> 16)) >>> 0;
}

// Small seeded random number generator (mulberry32). Returns numbers in [0, 1)
function mulberry32(seed) {
    let a = seed;
    return function () {
        a |= 0;
        a = (a + 0x6D2B79F5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

export function makeSeed(mouseX, mouseY, time) {
    return hashString(`${mouseX},${mouseY},${time}`);
}


// ---------- Composition (pure: no audio in here) ----------

const MODES = [
    ["ionian",     [0, 2, 4, 5, 7, 9, 11]],
    ["dorian",     [0, 2, 3, 5, 7, 9, 10]],
    ["aeolian",    [0, 2, 3, 5, 7, 8, 10]],
    ["lydian",     [0, 2, 4, 6, 7, 9, 11]],
    ["mixolydian", [0, 2, 4, 5, 7, 9, 10]],
];

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const BARS = 8;                        // length of the loop
const MELODY_LOW = 5;                  // melody range, in scale degrees above the root
const MELODY_HIGH = 14;

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function compose(seed) {
    const rand = mulberry32(seed);
    const pick = arr => arr[Math.floor(rand() * arr.length)];
    const chance = p => rand() < p;

    const rootMidi = 45 + Math.floor(rand() * 12);      // A2 .. G#3
    const [modeName, scale] = pick(MODES);
    const bpm = 64 + Math.floor(rand() * 25);           // 64 .. 88

    // Scale degree (0 = root, 7 = root one octave up, -1 = below the root...) to a midi note
    function degreeToMidi(degree) {
        const octave = Math.floor(degree / 7);
        const index = ((degree % 7) + 7) % 7;
        return rootMidi + scale[index] + 12 * octave;
    }

    // Four chords (as scale degrees) that repeat. Starts on the tonic, never uses the 7th degree (diminished)
    const progression = [0, pick([5, 3, 2]), pick([3, 1, 5]), pick([4, 3])];

    // Pad: one triad per bar
    const padEvents = [];
    for (let bar = 0; bar < BARS; bar++) {
        const d = progression[bar % 4];
        padEvents.push({
            time: `${bar}:0:0`,
            midi: [0, 2, 4].map(k => degreeToMidi(d + k) + 12),
            duration: "1m",
        });
    }

    // Bass: root on the first beat, sometimes the root or fifth again on beat three
    const bassEvents = [];
    for (let bar = 0; bar < BARS; bar++) {
        const d = progression[bar % 4];
        const second = chance(0.6);
        bassEvents.push({
            time: `${bar}:0:0`,
            midi: degreeToMidi(d) - 12,
            duration: second ? "2n" : "2n.",
        });
        if (second) {
            bassEvents.push({
                time: `${bar}:2:0`,
                midi: degreeToMidi(d + (chance(0.5) ? 0 : 4)) - 12,
                duration: "4n",
            });
        }
    }

    // Melody: a 4 bar phrase made with a random walk through the scale,
    // that is then played again with some of its notes changed
    function nearestChordTone(degree, chordDegrees) {
        const tones = chordDegrees.map(d => ((d % 7) + 7) % 7);
        for (const offset of [0, -1, 1, -2, 2, -3, 3]) {
            if (tones.includes((((degree + offset) % 7) + 7) % 7)) {
                return clamp(degree + offset, MELODY_LOW, MELODY_HIGH);
            }
        }
        return degree;
    }

    let degree = 7;
    const phraseA = [];
    for (let bar = 0; bar < 4; bar++) {
        const chordDegrees = [0, 2, 4].map(k => progression[bar] + k);
        const steps = [];                                // 8 eighth notes per bar, null = rest

        for (let i = 0; i < 8; i++) {
            const onBeat = i % 2 === 0;

            if (chance(onBeat ? 0.12 : 0.35)) {
                steps.push(null);
                continue;
            }

            degree = clamp(degree + pick([-2, -1, -1, 0, 1, 1, 2]), MELODY_LOW, MELODY_HIGH);

            // Land on a note of the current chord at the start of the bar, and often on the other beats
            if (i === 0 || (onBeat && chance(0.5))) {
                degree = nearestChordTone(degree, chordDegrees);
            }

            steps.push(degree);
        }
        phraseA.push(steps);
    }
    phraseA[3][7] = null; // breathe before the phrase repeats

    const phraseB = phraseA.map(bar =>
        bar.map(step =>
            step !== null && chance(0.3)
                ? clamp(step + pick([-2, -1, 1, 2]), MELODY_LOW, MELODY_HIGH)
                : step
        )
    );

    const melodyEvents = [];
    for (let bar = 0; bar < BARS; bar++) {
        const steps = bar < 4 ? phraseA[bar] : phraseB[bar - 4];

        steps.forEach((step, i) => {
            if (step === null) return;

            const onBeat = i % 2 === 0;
            const followedByRest = onBeat && steps[i + 1] === null;

            melodyEvents.push({
                time: `${bar}:${Math.floor(i / 2)}:${(i % 2) * 2}`,
                midi: degreeToMidi(step),
                duration: followedByRest ? "4n" : "8n",
                velocity: (onBeat ? 0.5 : 0.35) + rand() * 0.1,
            });
        });
    }

    return {
        bpm,
        modeName,
        keyName: NOTE_NAMES[rootMidi % 12],
        padEvents,
        bassEvents,
        melodyEvents,
    };
}


// ---------- Playback ----------

const MUSIC_VOLUME = -14; // dB, quiet enough to sit behind the click sounds

let started = false;
let muted = false;
let musicOut = null;

function toNote(midi) {
    return Tone.Frequency(midi, "midi").toNote();
}

async function startMusic(seed) {
    if (started) return;
    started = true;

    await Tone.start(); // browsers only allow audio after a click

    const song = compose(seed);

    // Everything goes through one volume node so the music can be muted without touching the click sounds
    musicOut = new Tone.Volume(-60).toDestination();
    musicOut.mute = muted;
    musicOut.volume.rampTo(MUSIC_VOLUME, 4); // fade in

    const reverb = new Tone.Reverb({ decay: 7, wet: 0.45 }).connect(musicOut);

    // Pad
    const padFilter = new Tone.Filter(1100, "lowpass").connect(reverb);
    const pad = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle" },
        envelope: { attack: 1.5, decay: 0.5, sustain: 0.8, release: 2.5 },
    }).connect(padFilter);
    pad.volume.value = -8;

    // Bass
    const bass = new Tone.Synth({
        oscillator: { type: "sine" },
        envelope: { attack: 0.05, decay: 0.3, sustain: 0.6, release: 1 },
    }).connect(musicOut);
    bass.volume.value = -6;

    // Melody
    const delay = new Tone.FeedbackDelay({ delayTime: "8n.", feedback: 0.35, wet: 0.3 }).connect(reverb);
    const melody = new Tone.Synth({
        oscillator: { type: "triangle" },
        envelope: { attack: 0.02, decay: 0.3, sustain: 0.2, release: 1.5 },
    }).connect(delay);
    melody.volume.value = -10;

    const parts = [
        new Tone.Part((time, e) => pad.triggerAttackRelease(e.midi.map(toNote), e.duration, time, 0.5), song.padEvents),
        new Tone.Part((time, e) => bass.triggerAttackRelease(toNote(e.midi), e.duration, time, 0.7), song.bassEvents),
        new Tone.Part((time, e) => melody.triggerAttackRelease(toNote(e.midi), e.duration, time, e.velocity), song.melodyEvents),
    ];

    for (const part of parts) {
        part.loop = true;
        part.loopEnd = `${BARS}m`;
        part.start(0);
    }

    Tone.Transport.bpm.value = song.bpm;
    Tone.Transport.start("+0.1");

    console.log(`Music seed ${seed}: ${song.keyName} ${song.modeName}, ${song.bpm} bpm`);
}

export function setMusicMuted(value) {
    muted = value;
    if (musicOut) musicOut.mute = value;
}

// Keeps track of the mouse from now on and starts the music on the first click
// (browsers don't allow sound before that). The seed is made from the mouse position
// and the time at that moment. onStart(seed) is called when the music has started.
// Returns a cleanup function.
export function initMusic(onStart) {
    if (started) return () => {};

    let pointer = { x: 0, y: 0 };

    function track(e) {
        pointer = { x: e.clientX, y: e.clientY };
    }

    async function onFirstClick() {
        cleanup();
        const seed = makeSeed(pointer.x, pointer.y, Date.now());
        await startMusic(seed);
        if (onStart) onStart(seed);
    }

    function cleanup() {
        window.removeEventListener("pointermove", track);
        window.removeEventListener("pointerdown", track);
        window.removeEventListener("click", onFirstClick, true);
    }

    window.addEventListener("pointermove", track);
    window.addEventListener("pointerdown", track);
    window.addEventListener("click", onFirstClick, true); // capture, so it runs before the button handlers

    return cleanup;
}
