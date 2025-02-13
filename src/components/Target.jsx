// src/components/Target.jsx
import React, { useState, useEffect } from "react";
import "../style/game.css";

const Target = ({ onHit }) => {
  const [position, setPosition] = useState({ top: "50%", left: "50%" });

  useEffect(() => {
    const moveTarget = () => {
      const newTop = Math.random() * 80 + "%";
      const newLeft = Math.random() * 80 + "%";
      setPosition({ top: newTop, left: newLeft });
    };

    const interval = setInterval(moveTarget, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <img
      src="/assets/target.jpg"
      alt="Target"
      className="target"
      style={position}
      onClick={onHit}
    />
  );
};

export default Target;
