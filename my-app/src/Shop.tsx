import "./Shop.css"

function Shop({shop_elements, buy_function})
{
    
    
    return (
        
        <div className="Shop-Menu">
           
            <ul>
                
                {shop_elements.map(shop_element => <h3>{shop_element[0]}<button onClick={()=>{
                    buy_function(shop_element[0], shop_element[1])
                }}>BUY {shop_element[1]}€</button></h3>)}
                
            </ul>
           
        </div>
    )

}

export default Shop