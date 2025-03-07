import React, { useEffect, useState } from "react";
import "../style/game.css";
import { Howl } from "howler";

const Bullet = ({ id, startX, startY, targetX, targetY, onRemove, increaseScore }) => {
  const [position, setPosition] = useState({ left: `${startX}px`, top: `${startY}px` });

  // 🔹 Retrieve character from localStorage
  const character = localStorage.getItem("character") || "Allen";

  // 🔹 Set fire image and sound dynamically
  const fireImageSrc = character === "Allen" ? "/assets/Allen_Fire.png" : "/assets/Shaila_Fall.png";
  const fireSoundSrc = character === "Allen" ? "/assets/Allen_got_shooted.wav" : "/assets/Shaila_got_shooted.wav";

  const hitSound = new Howl({
    src: [fireSoundSrc], // 🔥 Dynamically use the correct sound
    volume: 0.8,
  });

  

  useEffect(() => {
    console.log(`Bullet ${id} spawned at`, startX, startY);

    const angle = Math.atan2(targetY - startY, targetX - startX);
    let endX = startX + Math.cos(angle) * window.innerWidth * 2;
    let endY = startY + Math.sin(angle) * window.innerHeight * 2;

    setTimeout(() => {
      setPosition({ left: `${endX}px`, top: `${endY}px` });
    }, 10);

    const checkCollision = setInterval(() => {
      const bulletElement = document.querySelector(`.bullet-${id}`);
      const targetElement = document.querySelector(".target");

      if (bulletElement && targetElement) {
        const bulletRect = bulletElement.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();

        if (
          bulletRect.left < targetRect.right &&
          bulletRect.right > targetRect.left &&
          bulletRect.top < targetRect.bottom &&
          bulletRect.bottom > targetRect.top
        ) {
      
          increaseScore();
          targetElement.style.opacity = "0";
          targetElement.style.visibility = "hidden";

          const fireImage = document.createElement("img");
          fireImage.src = fireImageSrc;
          fireImage.classList.add("fire-image");
          fireImage.style.left = `${targetRect.left + targetRect.width / 2 - 50}px`; // Adjust positioning
          fireImage.style.top = `${targetRect.top + targetRect.height / 2 - 50}px`;  // Adjust positioning

          document.querySelector(".game-container").appendChild(fireImage);

          hitSound.play();

          setTimeout(() => {
            fireImage.remove();
            targetElement.style.opacity = "1";
            targetElement.style.visibility = "visible";
          }, 600);

          onRemove();
          clearInterval(checkCollision);
        }
      }
    }, 10);

    setTimeout(() => {
      clearInterval(checkCollision);
      onRemove();
    }, 1000);

    return () => clearInterval(checkCollision);
  }, [id, startX, startY, targetX, targetY, onRemove, increaseScore]);

  return <div className={`bullet bullet-${id}`} style={position}></div>;
};

export default Bullet;
