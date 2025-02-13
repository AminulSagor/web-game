// src/App.jsx
import React, { useState } from "react";
import Target from "./components/Target";
import Gun from "./components/Gun";
import ScoreBoard from "./components/ScoreBoard";
import "./style/game.css";

const App = () => {
  const [score, setScore] = useState(0);

  const handleHit = () => {
    setScore(score + 1);
  };

  return (
    <div className="game-container">
      <ScoreBoard score={score} />
      <Target onHit={handleHit} />
      <Gun onShoot={() => {}} />
    </div>
  );
};

export default App;
