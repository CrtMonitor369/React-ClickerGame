import { useState, useRef } from "react";
import jigsawImage from "./assets/jigsaw.webp";

//This is written with assistance from AI, but not entirely by AI like the doom fire effect 

function JigsawPiece({rot, position, ID, setPosition}) {
 

  const dragOffset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const [rotation, setRotation] = useState(rot);

  function handlePointerDown(e) {
    isDragging.current = true;

    dragOffset.current = {
      x: e.clientX - position[0],
      y: e.clientY - position[1],
    };

    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e) {
    if (!isDragging.current) return;

    // setPosition({
    //   x: e.clientX - dragOffset.current.x,
    //   y: e.clientY - dragOffset.current.y,
    // });
    setPosition(e.clientX - dragOffset.current.x, e.clientY - dragOffset.current.y, ID)
  }

  function handlePointerUp() {
    isDragging.current = false;
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        position: "absolute",
        left: position[0],
        top: position[1],
        width: 100,
        height: 100,
   
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "grab",
        userSelect: "none",
        touchAction: "none",
        borderRadius: 0,
        transform: `rotate(${rotation}deg)`,
         transformOrigin: "center",
      }}
    >
      <img
  src={jigsawImage}
  alt="Jigsaw piece"
  draggable={false}
  style={{
    width: "100%",
    height: "100%",
    objectFit: "contain",
    pointerEvents: "none",
    
  }}
/>
    </div>
  );
}



export default JigsawPiece