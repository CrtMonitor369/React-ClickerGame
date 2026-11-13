//Ai was used here for the part where it is checked if the puzzle is solved
//I do know how to do it, I just for whatever reason struggled to get it working properly
//I think my error was related to state


import JigsawPiece from "./JigsawPiece";
import { useState, useEffect } from "react";
import * as Tone from "tone";

// Size of the board the pieces live in (must match .jigsaw-board in App.css)
const BOARD_WIDTH = 460;
const BOARD_HEIGHT = 340;
const PIECE_SIZE = 100;

const originalPositions = [
    [20, 30],
    [120, 30],
    [220, 30],
    [320, 30]
];

// Where a piece (ID) snaps to when dropped near another piece (i): [x offset, y offset]
const snapOffsets = {
    "0-3": [10, 70],
    "3-0": [-10, -70],
    "0-1": [70, -10],
    "1-0": [-70, 10],
    "1-2": [10, 70],
    "2-1": [-10, -70],
    "2-3": [-70, 10],
    "3-2": [70, -10],
};

function Distance(position1, position2) {
    return (
        (position2.x - position1.x) ** 2 +
        (position2.y - position1.y) ** 2
    ) ** 0.5;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function JigsawPuzzle({ increasePoints, shouldRender }) {

    // Hooks have to run on every render, so the "not bought yet" check
    // happens further down, after all of them.
    const [jigsawPiecesRot, setJigsawPiecesRot] = useState([0, 90, 180, 270]);

    const [jigsawPiecesPosition, setJigsawPiecesPosition] = useState(originalPositions);

    function setPosition(x, y, ID) {
        // Keep the piece inside the board
        x = clamp(x, 0, BOARD_WIDTH - PIECE_SIZE);
        y = clamp(y, 0, BOARD_HEIGHT - PIECE_SIZE);

        setJigsawPiecesPosition(prev => {
            const updated = [...prev];
            const required_dist = 70;

            for (let i = 0; i < prev.length; i++) {
                if (i === ID) continue;

                const distance = Distance(
                    { x: x, y: y },
                    { x: prev[i][0], y: prev[i][1] }
                );

                const offset = snapOffsets[`${ID}-${i}`];

                if (distance <= required_dist && offset) {
                    updated[ID] = [prev[i][0] + offset[0], prev[i][1] + offset[1]];
                    return updated;
                }
            }

            updated[ID] = [x, y];
            return updated;
        });
    }

    // Check if all pieces are connected
    useEffect(() => {
        if (!shouldRender) return;

        const connected = [0, 1, 2].map(i =>
            Distance(
                { x: jigsawPiecesPosition[i][0], y: jigsawPiecesPosition[i][1] },
                { x: jigsawPiecesPosition[i + 1][0], y: jigsawPiecesPosition[i + 1][1] }
            )
        );

        // All pieces connected when their distances are correct
        if (connected.every(distance => distance < 80)) {

            const timeout = setTimeout(() => {
                increasePoints(1)
                setJigsawPiecesPosition(originalPositions);
                const synth = new Tone.Synth().toDestination();
                synth.triggerAttackRelease("D3", "16n");
            }, 1000);

            return () => clearTimeout(timeout);
        }

    }, [jigsawPiecesPosition, shouldRender]);


    return (
        <div className="jigsaw-board">
            {!shouldRender && (
                <p className="jigsaw-locked">Buy the Jigsaw Puzzle in the shop to unlock it.</p>
            )}

            {shouldRender && jigsawPiecesPosition.map((position, ID) => (
                <JigsawPiece
                    key={ID}
                    rot={jigsawPiecesRot[ID]}
                    position={position}
                    ID={ID}
                    setPosition={setPosition}
                />
            ))}
        </div>
    );
}

export default JigsawPuzzle;
