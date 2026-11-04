import JigsawPiece from "./JigsawPiece";
import { useState, useRef } from "react";

function JigsawPuzzle ()
{

const [jigsawPiecesRot, setJigsawPiecesRot] = useState([0, 90, 180, 270])
const [jigsawPiecesPosition, setJigsawPiecesPosition] = useState([[20,30], [120,30], [220,30], [320,30]])

function setPosition(x, y, ID) {
    
    setJigsawPiecesPosition(prev => {
        const updated = [...prev];
        updated[ID] = [x, y];
        return updated;
    });
}



return  <>
        <JigsawPiece rot = {jigsawPiecesRot[0]} position={jigsawPiecesPosition[0]}  ID={0} setPosition={setPosition}/>
        <JigsawPiece rot = {jigsawPiecesRot[1]}  position={jigsawPiecesPosition[1]} ID={1} setPosition={setPosition}/>
        <JigsawPiece rot = {jigsawPiecesRot[2]}  position={jigsawPiecesPosition[2]} ID={2} setPosition={setPosition}/>
        <JigsawPiece rot = {jigsawPiecesRot[3]}  position={jigsawPiecesPosition[3]} ID={3} setPosition={setPosition}/>
        </>

}


export default JigsawPuzzle