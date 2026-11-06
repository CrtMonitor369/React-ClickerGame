//Ai was used here for the part where it is checked if the puzzle is solved
//The solution would have been annoying to write hence I used AI


import JigsawPiece from "./JigsawPiece";
import { useState, useEffect } from "react";

function Distance(position1, position2) {
    return (
        (position2.x - position1.x) ** 2 +
        (position2.y - position1.y) ** 2
    ) ** 0.5;
}

function JigsawPuzzle({increasePoints}) {

    const originalPositions = [
        [20, 30],
        [120, 30],
        [220, 30],
        [320, 30]
    ];

    const [jigsawPiecesRot, setJigsawPiecesRot] = useState([0, 90, 180, 270]);

    const [jigsawPiecesPosition, setJigsawPiecesPosition] = useState(originalPositions);

    function setPosition(x, y, ID) {
        setJigsawPiecesPosition(prev => {
            const updated = [...prev];
            let required_dist = 70;

            for (let i = 0; i < prev.length; i++) {
                if (i === ID) continue;

                const distance = Distance(
                    { x: x, y: y },
                    { x: prev[i][0], y: prev[i][1] }
                );

                if (distance <= required_dist) {

                    if (ID == 0 && i == 3) {
                        updated[ID] = [...prev[i]];
                        updated[ID][1] += 70;
                        updated[ID][0] += 10;
                        return updated;
                    }

                    if (ID == 3 && i == 0) {
                        updated[ID] = [...prev[i]];
                        updated[ID][1] -= 70;
                        updated[ID][0] -= 10;
                        return updated;
                    }

                    if (ID == 0 && i == 1) {
                        updated[ID] = [...prev[i]];
                        updated[ID][1] -= 10;
                        updated[ID][0] += 70;
                        return updated;
                    }

                    if (ID == 1 && i == 0) {
                        updated[ID] = [...prev[i]];
                        updated[ID][1] += 10;
                        updated[ID][0] -= 70;
                        return updated;
                    }

                    if (ID == 1 && i == 2) {
                        updated[ID] = [...prev[i]];
                        updated[ID][1] += 70;
                        updated[ID][0] += 10;
                        return updated;
                    }

                    if (ID == 2 && i == 1) {
                        updated[ID] = [...prev[i]];
                        updated[ID][1] -= 70;
                        updated[ID][0] -= 10;
                        return updated;
                    }

                    if (ID == 2 && i == 3) {
                        updated[ID] = [...prev[i]];
                        updated[ID][1] += 10;
                        updated[ID][0] -= 70;
                        return updated;
                    }

                    if (ID == 3 && i == 2) {
                        updated[ID] = [...prev[i]];
                        updated[ID][1] -= 10;
                        updated[ID][0] += 70;
                        return updated;
                    }
                }
            }

            updated[ID] = [x, y];
            return updated;
        });
    }

    // Check if all pieces are connected
    useEffect(() => {

        const connected = [
            Distance(
                { x: jigsawPiecesPosition[0][0], y: jigsawPiecesPosition[0][1] },
                { x: jigsawPiecesPosition[1][0], y: jigsawPiecesPosition[1][1] }
            ),
            Distance(
                { x: jigsawPiecesPosition[1][0], y: jigsawPiecesPosition[1][1] },
                { x: jigsawPiecesPosition[2][0], y: jigsawPiecesPosition[2][1] }
            ),
            Distance(
                { x: jigsawPiecesPosition[2][0], y: jigsawPiecesPosition[2][1] },
                { x: jigsawPiecesPosition[3][0], y: jigsawPiecesPosition[3][1] }
            )
        ];

        // All pieces connected when their distances are correct
        if (connected.every(distance => distance < 80)) {

            setTimeout(() => {
                increasePoints(1)
                setJigsawPiecesPosition(originalPositions);
            }, 1000);

        }

    }, [jigsawPiecesPosition]);


    return <>
        <JigsawPiece
            rot={jigsawPiecesRot[0]}
            position={jigsawPiecesPosition[0]}
            ID={0}
            setPosition={setPosition}
        />

        <JigsawPiece
            rot={jigsawPiecesRot[1]}
            position={jigsawPiecesPosition[1]}
            ID={1}
            setPosition={setPosition}
        />

        <JigsawPiece
            rot={jigsawPiecesRot[2]}
            position={jigsawPiecesPosition[2]}
            ID={2}
            setPosition={setPosition}
        />

        <JigsawPiece
            rot={jigsawPiecesRot[3]}
            position={jigsawPiecesPosition[3]}
            ID={3}
            setPosition={setPosition}
        />
    </>;
}

export default JigsawPuzzle;