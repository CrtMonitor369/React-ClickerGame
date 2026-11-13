import "./Button.css";
import * as Tone from "tone";

// One shared synth instead of creating a new one on every click.
// PolySynth so that rapid clicks can overlap without Tone throwing timing errors.
let synth = null;
function playNote(note, duration) {
    if (!synth) synth = new Tone.PolySynth(Tone.Synth).toDestination();
    synth.triggerAttackRelease(note, duration);
}

// variant: "default" (small box) or "square" (the big thing to click)
function Button({ onPressed, content, shouldRender = true, note = "C3", duration = "8n", variant = "default" }) {
    if (!shouldRender) return null;

    function handleClick() {
        onPressed();
        playNote(note, duration);

        const heading = document.querySelector("h1");
        if (heading) {
            heading.classList.add("DownwardMotion");
            setTimeout(() => heading.classList.remove("DownwardMotion"), 150);
        }
    }

    return (
        <button className={`Button Button--${variant}`} onClick={handleClick}>
            {content}
        </button>
    );
}

export default Button;
