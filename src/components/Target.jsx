import React, { useEffect, useState } from "react";
import "../style/game.css";

const Target = ({ position, setPosition, isPaused ,character}) => {
  const [isHit, setIsHit] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const moveTarget = () => {
      setIsHit(false); // Reset fire effect when target moves
      const newTop = Math.random() * 80 + "%";
      const newLeft = Math.random() * 80 + "%";
      setPosition({ top: newTop, left: newLeft });
    };

    const interval = setInterval(moveTarget, 1500);
    return () => clearInterval(interval);
  }, [setPosition, isPaused]);

  return (
    <img
      src={character === "Allen" ? "/assets/Allen_Normal.png" : "/assets/Shaila_Normal.png"}
      alt={character}
      className={`target ${isHit ? "fire-effect" : ""}`}
      style={{ ...position, width: "100px", height: "auto", position: "absolute" }}
    />
  );
  
};

export default Target;
