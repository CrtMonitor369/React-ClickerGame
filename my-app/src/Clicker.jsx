import "./Clicker.css"
import Button from "./Button"

function Clicker({ onPressed, points }) {

    return (
        <div className="Clicker-Area">
            <Button variant="square" onPressed={onPressed} content={"Press me!"} />
            <h1>{points}</h1>
        </div>
    )

}

export default Clicker
