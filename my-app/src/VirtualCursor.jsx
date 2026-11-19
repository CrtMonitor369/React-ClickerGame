import { useEffect, useRef } from "react";
import "./VirtualCursor.css";

/*
A mouse pointer you control with the keyboard.

- Arrow keys move it (hold to speed up), Enter presses it (hold Enter + arrows to drag).
- It appears when an arrow key or Enter is pressed, and hides again when the real mouse moves.
- Pressing sends pointerdown / pointerup / click to whatever is under the pointer,
  so the buttons and the draggable jigsaw pieces work without any changes.
*/

const DIRECTIONS = {
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
};

const START_SPEED = 300;   // pixels per second
const MAX_SPEED = 1000;
const ACCELERATION = 1200; // pixels per second, per second

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function VirtualCursor() {
    const cursorRef = useRef(null);

    useEffect(() => {
        const cursor = cursorRef.current;

        const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const held = new Set();      // arrow keys currently down
        let speed = START_SPEED;
        let lastTime = 0;
        let frame = 0;
        let visible = false;
        let hovered = null;          // button that currently shows the hover look
        let pressTarget = null;      // element the pointer was pressed on (Enter held)
        let pressButton = null;

        function draw() {
            cursor.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
        }

        function elementUnder() {
            return document.elementFromPoint(pos.x, pos.y);
        }

        // The real :hover can't be triggered from code, so buttons get a class that looks the same
        function setHover(target) {
            const button = target ? target.closest(".Button") : null;
            if (button === hovered) return;
            if (hovered) hovered.classList.remove("virtual-hover");
            if (button) button.classList.add("virtual-hover");
            hovered = button;
        }

        function fire(type, target) {
            target.dispatchEvent(new PointerEvent(type, {
                bubbles: true,
                cancelable: true,
                composed: true,
                clientX: pos.x,
                clientY: pos.y,
                pointerId: 9999,
                pointerType: "mouse",
                isPrimary: true,
                button: 0,
                buttons: type === "pointerup" ? 0 : 1,
            }));
        }

        function press() {
            if (pressTarget) return;
            const target = elementUnder();
            if (!target) return;

            pressTarget = target;
            pressButton = target.closest("button");
            if (pressButton) pressButton.classList.add("virtual-active");
            fire("pointerdown", target);
        }

        function release(allowClick) {
            if (!pressTarget) return;

            fire("pointerup", pressTarget);
            if (pressButton) pressButton.classList.remove("virtual-active");

            // Like a real mouse: it only counts as a click if you let go over the same button
            const under = elementUnder();
            if (allowClick && pressButton && under && under.closest("button") === pressButton) {
                pressButton.click();
            }

            pressTarget = null;
            pressButton = null;
        }

        function show() {
            if (visible) return;
            visible = true;
            cursor.classList.add("is-visible");
            draw();
            setHover(elementUnder());
        }

        function hide() {
            if (!visible) return;
            release(false);
            held.clear();
            visible = false;
            cursor.classList.remove("is-visible");
            setHover(null);
        }

        function tick(now) {
            frame = 0;
            if (held.size === 0) {
                lastTime = 0;
                speed = START_SPEED;
                return;
            }

            const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 1 / 60;
            lastTime = now;
            speed = Math.min(speed + ACCELERATION * dt, MAX_SPEED);

            let dx = 0;
            let dy = 0;
            for (const key of held) {
                dx += DIRECTIONS[key][0];
                dy += DIRECTIONS[key][1];
            }

            if (dx !== 0 || dy !== 0) {
                const length = Math.hypot(dx, dy); // so diagonals aren't faster
                pos.x = clamp(pos.x + (dx / length) * speed * dt, 0, window.innerWidth - 1);
                pos.y = clamp(pos.y + (dy / length) * speed * dt, 0, window.innerHeight - 1);
                draw();

                if (pressTarget) fire("pointermove", pressTarget); // dragging
                else setHover(elementUnder());
            }

            frame = requestAnimationFrame(tick);
        }

        function onKeyDown(e) {
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            if (e.key in DIRECTIONS) {
                e.preventDefault(); // no page scrolling
                show();
                held.add(e.key);
                if (!frame) frame = requestAnimationFrame(tick);
            } else if (e.key === "Enter") {
                e.preventDefault(); // otherwise a focused button would be clicked as well
                show();
                if (!e.repeat) press();
            }
        }

        function onKeyUp(e) {
            if (e.key in DIRECTIONS) {
                held.delete(e.key);
            } else if (e.key === "Enter") {
                release(true);
            }
        }

        // The pointer events made by this component are not "trusted", so only the real mouse hides the cursor.
        // The real mouse position is remembered so the cursor starts from there next time.
        function onMouseMove(e) {
            if (!e.isTrusted) return;
            pos.x = e.clientX;
            pos.y = e.clientY;
            hide();
        }

        function onBlur() {
            held.clear();
            release(false);
        }

        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("blur", onBlur);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("blur", onBlur);
            if (frame) cancelAnimationFrame(frame);
            release(false);
            setHover(null);
        };
    }, []);

    return (
        <div ref={cursorRef} className="virtual-cursor" aria-hidden="true">
            <svg width="26" height="26" viewBox="0 0 26 26">
                <path
                    d="M1 1 L1 21 L6.5 16 L10.5 25 L14 23.5 L10 15 L18 15 Z"
                    fill="black"
                    stroke="rgb(0, 236, 253)"
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
}

export default VirtualCursor;
