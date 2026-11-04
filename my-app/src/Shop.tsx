import "./Shop.css"
import Button from "./Button.jsx"

function Shop({ shop_elements, buy_function }) {


    return (

        <div className="Shop-Menu">

            <ul>

                {shop_elements.map(shop_element => <h3>{shop_element[0]}<Button onPressed={() => { buy_function(shop_element[0], shop_element[1]) }}
                    content={shop_element[1] + "€"} />

                </h3>)
                }

            </ul>

        </div>
    )

}

export default Shop