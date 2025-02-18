import React, { useState, useRef, useEffect } from "react";
import { Howl } from "howler";
import Bullet from "./Bullet";
import "../style/game.css";
import Target from "./Target";
import { updateUserScore } from '../services/api'; 

const gunfireSound = new Howl({
  src: ["/assets/gun.mp3"],
  volume: 0.5,
  rate: 1.2,
});

const Gun = ({ email }) => { 
  const [bullets, setBullets] = useState([]);
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState({ left: 300, top: 200 });
  const [gunAngle, setGunAngle] = useState(0);
  const shootingInterval = useRef(null);
  const barrelRef = useRef(null);

  const calculateGunAngle = (mouseX, mouseY) => {
    const gunX = window.innerWidth / 2;
    const gunY = window.innerHeight - 80;
    return Math.atan2(mouseY - gunY, mouseX - gunX) * (180 / Math.PI);
  };

  const getBarrelEndpoint = () => {
    if (!barrelRef.current) return { x: window.innerWidth / 2, y: window.innerHeight - 80 };

    const barrelRect = barrelRef.current.getBoundingClientRect();
    const barrelX = barrelRect.left + barrelRect.width / 2;
    const barrelY = barrelRect.top + barrelRect.height / 2;
    
    const angleRad = (gunAngle * Math.PI) / 180;
    const barrelLength = 50;

    return {
      x: barrelX + Math.cos(angleRad) * barrelLength,
      y: barrelY + Math.sin(angleRad) * barrelLength,
    };
  };

  const startShooting = (event) => {
    if (shootingInterval.current) return;

    setGunAngle(calculateGunAngle(event.clientX, event.clientY));

    shootingInterval.current = setInterval(() => {
      gunfireSound.play();

      const { x: startX, y: startY } = getBarrelEndpoint();
      
      const newBullet = {
        id: Date.now(),
        startX,
        startY,
        targetX: event.clientX,
        targetY: event.clientY,
      };

      console.log("New Bullet:", newBullet);
      setBullets((prevBullets) => [...prevBullets, newBullet]);

      setTimeout(() => {
        setBullets((prevBullets) => prevBullets.filter((b) => b.id !== newBullet.id));
      }, 500);
    }, 100);
  };

  const stopShooting = () => {
    clearInterval(shootingInterval.current);
    shootingInterval.current = null;
  };

  useEffect(() => {
    if (score === 0) return; 

    const updateScore = async () => {
      try {
        console.log("Updating score for:", email, "New Score:", score);
        await updateUserScore(email, score);
      } catch (error) {
        console.error("Error updating score:", error);
      }
    };

    updateScore();
  }, [score, email]);

  return (
    <div
      className="game-container"
      onMouseDown={startShooting}
      onMouseUp={stopShooting}
      onMouseLeave={stopShooting}
      onMouseMove={(event) => setGunAngle(calculateGunAngle(event.clientX, event.clientY))}
    >
      <div className="scoreboard">Score: {score}</div>
      <Target position={target} setPosition={setTarget} />

      <div className="gun-container" style={{ transform: `rotate(${gunAngle}deg)` }}>
        <div className="gun-body">
          <div ref={barrelRef} className="gun-barrel"></div>
          <div className="gun-handle"></div>
          <div className="gun-stock"></div>
          <div className="gun-trigger"></div>
        </div>
      </div>

      {bullets.map((bullet) => (
        <Bullet
          key={bullet.id}
          id={bullet.id} // Unique ID
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

export default Gun;
