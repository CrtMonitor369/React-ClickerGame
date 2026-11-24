


import { useEffect, useRef } from "react";

function DoomFire({ active, onFinished }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!active) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const width = 160;
        const height = 100;

        canvas.width = width;
        canvas.height = height;

        const firePixels = new Array(width * height).fill(0);

        const palette = [
            [0, 0, 0],
            [31, 7, 7],
            [47, 15, 7],
            [71, 15, 7],
            [87, 23, 7],
            [103, 31, 7],
            [119, 31, 7],
            [143, 39, 7],
            [159, 47, 7],
            [175, 63, 7],
            [191, 71, 7],
            [199, 71, 7],
            [223, 79, 7],
            [223, 87, 7],
            [223, 95, 7],
            [215, 111, 7],
            [215, 119, 7],
            [215, 127, 7],
            [215, 135, 7],
            [215, 143, 7],
            [215, 151, 7],
            [215, 159, 7],
            [215, 167, 7],
            [239, 191, 63],
            [239, 199, 111],
            [239, 207, 159],
            [255, 255, 255]
        ];

        // Ignite the bottom row
        function ignite() {
            for (let x = 0; x < width; x++) {
                firePixels[(height - 1) * width + x] = 26;
            }
        }

        function updateFire() {
            for (let y = 0; y < height - 1; y++) {
                for (let x = 0; x < width; x++) {
                    const src = (y + 1) * width + x;
                    const decay = Math.floor(Math.random() * 3);
                    const dst = y * width +
                        Math.max(0, Math.min(width - 1, x + Math.floor(Math.random() * 3) - 1)); //The bulk of this code is to ensure that it doesn't go out of bounds
                    
                    firePixels[dst] = Math.max(0, firePixels[src] - decay);
                }
            }
        }

        function renderFire() {
            const imageData = ctx.createImageData(width, height);

            for (let i = 0; i < firePixels.length; i++) {
                const color = palette[firePixels[i]];

                imageData.data[i * 4] = color[0];
                imageData.data[i * 4 + 1] = color[1];
                imageData.data[i * 4 + 2] = color[2];
                imageData.data[i * 4 + 3] = 255;
            }

            ctx.putImageData(imageData, 0, 0);
        }

        ignite();

        const interval = setInterval(() => {
            updateFire();
            renderFire();
        }, 30);

        const timeout = setTimeout(() => {
            clearInterval(interval);
            onFinished();
        }, 2500);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [active, onFinished]);

    if (!active) return null;

    return (
        <div className="doom-fire-overlay">
            <canvas ref={canvasRef} />
        </div>
    );
}

export default DoomFire;
