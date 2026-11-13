import "./Shop.css"
import Button from "./Button.jsx"

function Shop({ shop_elements, buy_function }) {

    return (
        <div className="Shop-Menu">
            <h3>Shop</h3>

            <ul>
                {shop_elements.map(shop_element =>
                    <li className="Shop-Item" key={shop_element[0]}>
                        <h3>{shop_element[0]}</h3>
                        <Button
                            onPressed={() => buy_function(shop_element[0], shop_element[1])}
                            content={shop_element[1] + "€"}
                        />
                    </li>
                )}
            </ul>
        </div>
    )

}

export default Shop
