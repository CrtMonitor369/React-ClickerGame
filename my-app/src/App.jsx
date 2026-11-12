

import Clicker from "./Clicker.jsx";
import Button from "./Button.jsx";
import { useState, useEffect } from "react";
import Shop from "./Shop.jsx";
import "./App.css";
import DoomFire from "./DoomFire.jsx";
import JigsawPuzzle from "./JigsawPuzzle.jsx";
import * as Tone from "tone";




function App() {
    const synth = new Tone.Synth().toDestination();
    const [points, setPoints] = useState(0);

    const [shopItems, setShopItems] = useState([
        ["Multiplier", 10],
        ["Auto Clicker", 50],
        ["Jigsaw Puzzle", 1000]
    ]);

    const [MultiplierLvl, setMultiplierLvl] = useState(1);
    const [AutoClickerLvl, setAutoClickerLvl] = useState(0);

    const [gameState, setGameState] = useState("StartScreen");
    const [rebirthCount, setRebirth] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [isFading, setIsFading] = useState(false);
    const [fireActive, setFireActive] = useState(false);
    const [boughtJigsaw, setBoughtJigsaw] = useState(false);
    
    useEffect(() => {
        if (AutoClickerLvl <= 0) return;

        const interval = setInterval(() => {
            setPoints(prev =>
                prev + AutoClickerLvl * MultiplierLvl
            );
        }, 1000);

        return () => clearInterval(interval);
    }, [AutoClickerLvl, MultiplierLvl]);

    useEffect(() => {
        if (gameState !== "Game") return;

        const interval = setInterval(() => {
            onPressSave();
        }, 1000);

        return () => clearInterval(interval);
    }, [gameState, points, rebirthCount, MultiplierLvl, AutoClickerLvl, shopItems]);

    function onPressSave() {
        setIsSaving(true);

        const saveData = {
    Points: points,
    RebirthCount: rebirthCount,
    MultiplierLvl: MultiplierLvl,
    AutoClickerLvl: AutoClickerLvl,
    ShopItems: shopItems,
    BoughtJigsaw: boughtJigsaw
};

        localStorage.setItem("save_file", JSON.stringify(saveData));

        console.log("Game saved!");

        setTimeout(() => {
            setIsSaving(false);
        }, 1000);
    }

    function loadGame() {
        const savedData = localStorage.getItem("save_file");

        if (savedData) {
            try {
                const loadedSave = JSON.parse(savedData);

                setPoints(loadedSave.Points ?? 0);
                setRebirth(loadedSave.RebirthCount ?? 0);
                setMultiplierLvl(loadedSave.MultiplierLvl ?? 1);
                setAutoClickerLvl(loadedSave.AutoClickerLvl ?? 0);
                setBoughtJigsaw(loadedSave.BoughtJigsaw ?? false);
                setShopItems(
                    loadedSave.ShopItems ?? [
                        ["Multiplier", 10],
                        ["Auto Clicker", 50]
                    ]
                );

                console.log("Game loaded!");
            } catch (error) {
                console.error("Failed to load save:", error);
            }
        }

        setGameState("Game");
    }

    function handlePlay() {
        setIsFading(true);

        setTimeout(() => {
            loadGame();
        }, 500);
    }
    function d_GetFreeMoney()
    {
        setPoints(Infinity)
    }
    function d_GetTheOppositeOfInfiniteMoney()
    {
        setPoints(0)
    }
    function onPressClicker() {
        
        setPoints(prev =>
            prev + (1 + 0.25 * rebirthCount) * MultiplierLvl
        );
    }

    function onPressBuy(name, cost) {
        if (cost <= points) {

            if (name === "Multiplier") {
                setMultiplierLvl(prev => prev + 1);

                setShopItems(prev =>
                    prev.map(item =>
                        item[0] === "Multiplier"
                            ? ["Multiplier", 4 * item[1]]
                            : item
                    )
                );
            }

            if (name === "Auto Clicker") {
                setAutoClickerLvl(prev => prev + 1);

                setShopItems(prev =>
                    prev.map(item =>
                        item[0] === "Auto Clicker"
                            ? ["Auto Clicker", Math.floor(item[1] * 1.5)]
                            : item
                    )
                );
                
            }
            if (name === "Jigsaw Puzzle") {
            setShopItems(prev =>
                prev.filter(item => item[0] !== "Jigsaw Puzzle")
            );

            setBoughtJigsaw(true);
        }

            setPoints(prev => prev - cost);
        }
    }
    function increasePoints(a)
    {
        setPoints(prev => prev + a)
    }
    function onPressRebirth() {
        if (points >= (10 + rebirthCount * 30)) {
            setPoints(0);
            setRebirth(prev => prev + 1);

            setMultiplierLvl(1);
            setAutoClickerLvl(0);

            setShopItems([
                ["Multiplier", 10],
                ["Auto Clicker", 50]
            ]);
        }
    }

    function onPressClear() {
        localStorage.removeItem("save_file");

        setFireActive(true);
    }

    if (gameState === "StartScreen") {
    return (
        <>
            <div className={`StartScreen ${isFading ? "fade-out" : ""}`}>
                <h1>Clicker Game</h1>

                <Button
                    content={"Press Play"}
                    onPressed={handlePlay}
                    note={"D3"}
                    duration={"16n"}
                />

                <Button
                    content={"Clear Save Data"}
                    onPressed={onPressClear}
                />
            </div>

            <DoomFire
                active={fireActive}
                onFinished={() => setFireActive(false)}
            />
        </>
    );
}

    return (
        <>
            <Clicker
                onPressed={onPressClicker}
                points={points}
            />

            <div>
                <Button
                    content={"Rebirth"}
                    onPressed={onPressRebirth}
                />

                <h4>
                    Required points {10 + rebirthCount * 30}
                </h4>
            </div>

            <h3>Upgrade Stats</h3>

            <p>Multiplier Level: {MultiplierLvl}</p>
            <p>Auto Clicker Level: {AutoClickerLvl}</p>
            <p>Auto Clicker PPS: {AutoClickerLvl * MultiplierLvl}</p>

            <Shop
                shop_elements={shopItems}
                buy_function={onPressBuy}
            />
            
         
            <Button
                content={"Save"}
                onPressed={onPressSave}
            />
            <Button 
            content={"[debug] Unlimited money"}
            onPressed={d_GetFreeMoney}
            />
            <Button 
            content={"[debug] Pay your taxes"}
            onPressed={d_GetTheOppositeOfInfiniteMoney}
            />
            {isSaving && (
                <h3 className="Saving">Saving...</h3>
            )}
           <JigsawPuzzle increasePoints={increasePoints} shouldRender = {boughtJigsaw}/>
            
        </>
    );
     
}

export default App;
