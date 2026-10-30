import Clicker from "./Clicker.jsx"
import Button from "./Button.jsx"
import { useState } from 'react';
import Shop from "./Shop.tsx"
import "./App.css"

function App() {
    
    const [points, setPoints] = useState(0)
    const [shopItems, setShopItems] = useState([
        ["Multiplier", 10],
         
        ])
    const [MultiplierLvl, setMultiplierLvl] = useState(1)
    const [gameState, setGameState] = useState("StartScreen")
    function onPressClicker()
    {
        setPoints(points+1*MultiplierLvl)
    }

    function onPressBuy(name, cost)
    {
        
        if(cost <= points)
            {
                if(name == "Multiplier")
                {
                    setMultiplierLvl(MultiplierLvl+1)
                    let shopItems_tmp = shopItems
                    shopItems_tmp[0][1] = 4*parseInt(shopItems_tmp[0][1])
                    setShopItems(shopItems_tmp)
                   

                }
                setPoints(points-cost)
            }
        
    }
    
    if(gameState=="StartScreen")
    {
        return (<>
                <h1>Clicker Game</h1>
                <Button content = {"press play"} onPressed={()=>{
                    setGameState("Game")
                }} ></Button>
                </>)
    }
    return (<>
      
     <Clicker onPressed={onPressClicker} points = {points}></Clicker>

      <div>
        <Button content={"Rebirth"}></Button>
        <h4>Required points</h4>
      </div>
     <Shop shop_elements={shopItems} buy_function={onPressBuy}></Shop>
    </>)




}



export default App
