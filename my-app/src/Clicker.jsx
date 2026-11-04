import "./Clicker.css"
import Button from "./Button"
import { render, fireEvent } from '@testing-library/react';

function Clicker({ onPressed, points, automatorLvl }) {


    return (
        <div className="Clicker-Area">


            <Button id="clickButton" onPressed={onPressed} points={points} content={"press me!"}></Button>
            <h1>{points}</h1>
        </div>
    )

}

export default Clicker