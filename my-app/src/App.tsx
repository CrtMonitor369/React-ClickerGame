import Clicker from "./Clicker.jsx"
import { useState } from 'react';
import Shop from "./Shop.tsx"
function App() {

    const [points, setPoints] = useState(0)

    function onPressClicker()
    {
        setPoints(points+1)
    }


    
    return (<>
     
     <Clicker onPressed={onPressClicker} points = {points}></Clicker>

     <Shop shop_elements={[
        ["test", 100],
         ["aaaa", 100]
        ]}></Shop>
    </>)




}



export default App
