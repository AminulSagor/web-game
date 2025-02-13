// src/components/ScoreBoard.jsx
import React from "react";
import "../style/game.css";

const ScoreBoard = ({ score }) => {
  return <div className="scoreboard">Score: {score}</div>;
};

export default ScoreBoard;
