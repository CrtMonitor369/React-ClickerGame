import Clicker from "./Clicker.jsx"
import { useState } from 'react';
import Shop from "./Shop.tsx"
function App() {

    const [points, setPoints] = useState(0)
    const [shopItems, setShopItems] = useState([
        ["test", 10],
         ["aaaa", 10]
        ])
    function onPressClicker()
    {
        setPoints(points+1)
    }

    function onPressBuy(name, cost)
    {
        if(cost <= points)
            {
                setPoints(points-cost)
            }
        
    }
    
    return (<>
     
     <Clicker onPressed={onPressClicker} points = {points}></Clicker>

     <Shop shop_elements={shopItems} buy_function={onPressBuy}></Shop>
    </>)




}



export default App
