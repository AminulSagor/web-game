import React, { useState, useEffect, useRef } from "react";

import { Howl } from "howler";
import Bullet from "./Bullet";
import "../style/game.css";
import Target from "./Target";
import { getGameUserScore, getAllUsersScores, updateUserScore } from '../services/api';

const gunfireSound = new Howl({
  src: ["/assets/gun.mp3"],
  volume: 0.5,
  rate: 1.2,
});

const GunMobile = () => {
  const [bullets, setBullets] = useState([]);
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState({ left: 50, top: 200 });
  const [isPaused, setIsPaused] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLeaderboardExpanded, setIsLeaderboardExpanded] = useState(false);
  const [userEmail, setUserEmail] = useState(localStorage.getItem("email"));
  const [gunAngle, setGunAngle] = useState(0);
  const barrelRef = useRef(null);

  


  useEffect(() => {
    const fetchUserScore = async () => {
      const storedEmail = localStorage.getItem("email");
      if (!storedEmail) return;
      try {
        const existingScore = await getGameUserScore(storedEmail);
        setScore(existingScore ?? 0);
      } catch (error) {
        console.error("Error fetching user score:", error);
      }
    };
    fetchUserScore();
  }, []);

  useEffect(() => {
    if (!userEmail || score === 0) return;
    const updateScore = async () => {
      try {
        await updateUserScore(userEmail, score);
      } catch (error) {
        console.error("Error updating score:", error);
      }
    };
    updateScore();
  }, [score, userEmail]);

  const handleTap = (event) => {
    if (isPaused) return;
    const touch = event.touches[0];
  
    // Calculate gun rotation towards the tap
    const gunX = window.innerWidth / 2;
    const gunY = window.innerHeight - 80;
    const angle = Math.atan2(touch.clientY - gunY, touch.clientX - gunX) * (180 / Math.PI);
    setGunAngle(angle);
  
    // Play gunfire sound
    gunfireSound.play();
  
    const { x: startX, y: startY } = getBarrelEndpoint();

    const newBullet = {
      id: Date.now(),
      startX,
      startY,
      targetX: touch.clientX,
      targetY: touch.clientY,
    };
    
    setBullets((prev) => [...prev, newBullet]);
  
    setTimeout(() => {
      setBullets((prev) => prev.filter((b) => b.id !== newBullet.id));
    }, 500);
  };
  

  const toggleLeaderboard = async () => {
    setIsLeaderboardExpanded((prev) => !prev);
    if (!isLeaderboardExpanded) {
      try {
        const usersScores = await getAllUsersScores();
        setLeaderboard(usersScores);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    }
  };

  const getBarrelEndpoint = () => {
    if (!barrelRef.current) return { x: window.innerWidth / 2, y: window.innerHeight - 80 };
  
    // Get the bounding box of the barrel
    const barrelRect = barrelRef.current.getBoundingClientRect();
    const barrelX = barrelRect.left + barrelRect.width / 2;
    const barrelY = barrelRect.top + barrelRect.height / 2;
  
    // Calculate the barrel's angle (compensate for transforms)
    const angleRad = (gunAngle * Math.PI) / 180;
    const barrelLength = 50; // Adjust based on your gun-barrel length
  
    return {
      x: barrelX + Math.cos(angleRad) * barrelLength,
      y: barrelY + Math.sin(angleRad) * barrelLength,
    };
  };
  

  return (
    <div className="game-container" onTouchStart={handleTap}>
      {/* Scoreboard (Top Left) */}
      <div className="scoreboard" style={{ position: "absolute", top: "10px", left: "10px" }}>
        Score: {score}
      </div>

      {/* Leaderboard Button (Top Right) */}
      <button
        className="leaderboard-toggle"
        onClick={toggleLeaderboard}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          padding: "10px",
          backgroundColor: "#ffcc00",
          border: "none",
          borderRadius: "5px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        {isLeaderboardExpanded ? "❌ Close" : "🏆 Leaderboard"}
      </button>

      {/* Leaderboard Section */}
      {isLeaderboardExpanded && (
        <div className="leaderboard">
          <h3>Top Players</h3>
          <ol>
            {leaderboard.length > 0 ? (
              leaderboard.map((player, index) => (
                <li key={index}>
                  <span>{player.name}</span>
                  <span>{player.score}</span>
                </li>
              ))
            ) : (
              <p>No players found</p>
            )}
          </ol>
        </div>
      )}

   {/* Pause Button (Centered) */}
<button
  className="pause-button"
  onClick={() => setIsPaused(!isPaused)}
  style={{
    position: "absolute",
    top: "10px", // Position closer to the bottom
    right: "10px",
    transform: "none",
    padding: "8px 14px", // Smaller padding
    width: 110 ,
    backgroundColor: "#ff5733",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px", // Smaller text
    cursor: "pointer",
  }}
>
  {isPaused ? "▶ Resume" : "⏸ Pause"}
</button>


      {/* Target */}
      <Target position={target} setPosition={setTarget} isPaused={isPaused} />

      {/* Mobile-friendly Gun UI */}
      <div className="gun-container" style={{ transform: `rotate(${gunAngle}deg)` }}>

        <div className="gun-body">
        <div ref={barrelRef} className="gun-barrel"></div>
          <div className="gun-handle"></div>
          <div className="gun-stock"></div>
          <div className="gun-trigger"></div>
        </div>
      </div>

      {/* Bullets */}
      {bullets.map((bullet) => (
        <Bullet
          key={bullet.id}
          id={bullet.id}
          startX={bullet.startX}
          startY={bullet.startY}
          targetX={bullet.targetX}
          targetY={bullet.targetY}
          onRemove={() => setBullets((prev) => prev.filter((b) => b.id !== bullet.id))}
          increaseScore={() => setScore((prev) => prev + 10)}
        />
      ))}
    </div>
  );
};

export default GunMobile;
