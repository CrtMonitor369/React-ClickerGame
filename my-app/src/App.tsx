
import Clicker from "./Clicker.jsx";
import Button from "./Button.jsx";
import { useState } from "react";
import Shop from "./Shop.tsx";
import "./App.css";

function App() {
    const [points, setPoints] = useState(0);
    const [shopItems, setShopItems] = useState([
        ["Multiplier", 10]
    ]);
    const [MultiplierLvl, setMultiplierLvl] = useState(1);
    const [gameState, setGameState] = useState("StartScreen");
    const [rebirthCount, setRebirth] = useState(0);

   
    function onPressSave() {
        const saveData = {
            Points: points,
            RebirthCount: rebirthCount,
            MultiplierLvl: MultiplierLvl,
            ShopItems: shopItems
        };

        localStorage.setItem("save_file", JSON.stringify(saveData));

        console.log("Game saved!");
    }

    
    function loadGame() {
        const savedData = localStorage.getItem("save_file");

        if (savedData) {
            try {
                const loadedSave = JSON.parse(savedData);

                setPoints(loadedSave.Points ?? 0);
                setRebirth(loadedSave.RebirthCount ?? 0);
                setMultiplierLvl(loadedSave.MultiplierLvl ?? 1);
                setShopItems(
                    loadedSave.ShopItems ?? [["Multiplier", 10]]
                );

                console.log("Game loaded!");
            } catch (error) {
                console.error("Failed to load save:", error);
            }
        }

        setGameState("Game");
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

                setShopItems(prev => [
                    ["Multiplier", 4 * parseInt(prev[0][1])]
                ]);
            }

            setPoints(prev => prev - cost);
        }
    }

  
    function onPressRebirth() {
        if (points >= (10 + rebirthCount * 30)) {
            setPoints(0);
            setRebirth(prev => prev + 1);
            setMultiplierLvl(1);
            setShopItems([["Multiplier", 10]]);
        }
    }

  
    if (gameState === "StartScreen") {
        return (
            <>
                <h1>Clicker Game</h1>

                <Button
                    content={"Press Play"}
                    onPressed={loadGame}
                />
                
                <Button content={"Clear Save Data"}/>
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

            <Shop
                shop_elements={shopItems}
                buy_function={onPressBuy}
            />

            <Button
                content={"Save"}
                onPressed={onPressSave}
            />
        </>
    );
}

export default App;
