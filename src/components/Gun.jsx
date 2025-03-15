import React, { useState, useRef, useEffect } from "react";
import { Howl } from "howler";
import Bullet from "./Bullet";
import "../style/game.css";
import Target from "./Target";
import { getGameUserScore, getAllUsersScores  ,updateUserScore} from '../services/api'; 


const gunfireSound = new Howl({
  src: ["/assets/gun.mp3"],
  volume: 0.5,
  rate: 1.2,
});

const Gun = () => { 
  const [bullets, setBullets] = useState([]);
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState({ left: 300, top: 200 });
  const [gunAngle, setGunAngle] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const shootingInterval = useRef(null);
  const barrelRef = useRef(null);
  const [isLeaderboardExpanded, setIsLeaderboardExpanded] = useState(false);
  const [userEmail, setUserEmail] = useState(localStorage.getItem("email"));
  const [character, setCharacter] = useState(localStorage.getItem("character") || "Allen");

  useEffect(() => {
    const checkEmailUpdate = () => {
      const latestEmail = localStorage.getItem("email");
      if (latestEmail !== userEmail) {
        setUserEmail(latestEmail); // ✅ Update state if email changes
      }
    };

    // ✅ Listen for storage changes (e.g., new user registers)
    window.addEventListener("storage", checkEmailUpdate);

    return () => {
      window.removeEventListener("storage", checkEmailUpdate);
    };
  }, [userEmail]);

  useEffect(() => {
    const fetchUserScore = async () => {
      const storedEmail = localStorage.getItem("email");
      if (!storedEmail) {
        console.error("No email found in localStorage!");
        return;
      }
  
      try {
        console.log("Fetching score for:", storedEmail);
        const existingScore = await getGameUserScore(storedEmail);
  
        if (existingScore !== undefined) {
          setScore(existingScore); // ✅ Set fetched score
          console.log("User's existing score:", existingScore);
        } else {
          console.warn("Fetched score was undefined, setting to 0");
          setScore(0);
        }
      } catch (error) {
        console.error("Error fetching user score:", error);
      }
    };
  
    fetchUserScore(); // ✅ Fetch when entering the page
  }, []); // ✅ No dependencies, runs every time the page loads
  

  useEffect(() => {
    if (score === null || score === undefined || !userEmail) return; // ✅ Ensure valid score
    if (score === 0) return;

    const updateScore = async () => {
      try {
        console.log("Updating score for:", userEmail, "New Score:", score);
        await updateUserScore(userEmail, score);
      } catch (error) {
        console.error("Error updating score:", error);
      }
    };

    updateScore();
  }, [score, userEmail]);



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
    if (isPaused) return;
    if (event.target.closest("button")) return; // Prevent shooting when clicking buttons
  
    setGunAngle(calculateGunAngle(event.clientX, event.clientY));
  
    gunfireSound.play(); // Play gunfire sound
  
    const { x: startX, y: startY } = getBarrelEndpoint();
  
    const newBullet = {
      id: Date.now(),
      startX,
      startY,
      targetX: event.clientX,
      targetY: event.clientY,
    };
  
    setBullets((prevBullets) => [...prevBullets, newBullet]);
  
    // Remove bullet after 500ms
    setTimeout(() => {
      setBullets((prevBullets) => prevBullets.filter((b) => b.id !== newBullet.id));
    }, 500);
  };
  
  const stopShooting = () => {
    clearInterval(shootingInterval.current);
    shootingInterval.current = null;
  };

  useEffect(() => {
    if (score === 0) return; 

    const updateScore = async () => {
      try {
       
        await updateUserScore(userEmail, score);
      } catch (error) {
        console.error("Error updating score:", error);
      }
    };

    updateScore();
  }, [score, userEmail]);


  const toggleLeaderboard = async () => {
    setIsLeaderboardExpanded((prev) => !prev);
  
    if (!isLeaderboardExpanded) {  // Fetch leaderboard when opening
      try {
        const usersScores = await getAllUsersScores();
        setLeaderboard(usersScores);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    }
  };
  

  return (
    <div
      className="game-container"
      onMouseDown={startShooting}
      onMouseUp={stopShooting}
      onMouseLeave={stopShooting}
      onMouseMove={(event) => setGunAngle(calculateGunAngle(event.clientX, event.clientY))}
    >
      
      
       {/* Scoreboard */}
  {/* Scoreboard */}
  <div className="scoreboard">Score: {score}</div>

{/* Leaderboard Toggle Button */}
<button className="leaderboard-toggle" onClick={toggleLeaderboard}>
  {isLeaderboardExpanded ? "Close Leaderboard ❌" : "🏆 Leaderboard"}
</button>

{/* Leaderboard Section */}
{isLeaderboardExpanded && (
  <div className={`leaderboard ${isLeaderboardExpanded ? "expanded" : "collapsed"}`}>
    <h2>Top Players</h2>
    <ol>
      {leaderboard.map((player, index) => (
        <li key={index}>
          <span className="player-name">{player.name}</span>
          <span className="player-score">{player.score}</span>
        </li>
      ))}
    </ol>
  </div>
)}


      <div className="scoreboard">Score: {score}</div>
      <button className="pause-button" onClick={() => setIsPaused((prev) => !prev)}>
  {isPaused ? "Resume" : "Pause"}
</button>

<Target position={target} setPosition={setTarget} isPaused={isPaused} character={character} />


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

export default Gun;
