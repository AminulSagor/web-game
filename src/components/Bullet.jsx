import React, { useEffect, useState } from "react";
import "../style/game.css";
import { Howl } from "howler";

const Bullet = ({ id, startX, startY, targetX, targetY, onRemove, increaseScore }) => {
  const [position, setPosition] = useState({ left: `${startX}px`, top: `${startY}px` });

  // 🔹 Retrieve character from localStorage
  const character = localStorage.getItem("character") || "Allen";

  // 🔹 Set fire image and sound dynamically
  const fireImageSrc = character === "Allen" ? "/assets/Allen_Fire.png" : "/assets/Shaila_Fall.png";
  const fireSoundSrc = character === "Allen"
  ? Math.random() < 0.5 
    ? "/assets/Allen_got_shooted1.wav"  // Sound for even bullets
    : "/assets/Allen_got_shooted2.wav"   // Sound for odd bullets
  : "/assets/Shaila_got_shooted.wav";       // Single sound for Shaila

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

          const isMobile = window.innerWidth < 768;
          const fireImageSize = isMobile ? "60px" : "200px";

          const fireImage = document.createElement("img");
          fireImage.src = fireImageSrc;
          fireImage.style.position = "absolute";
          fireImage.style.width = fireImageSize;
          fireImage.style.height = fireImageSize;
          fireImage.style.left = `${targetRect.left + targetRect.width / 2 - 50}px`;
          fireImage.style.top = `${targetRect.top + targetRect.height / 2 - 50}px`;

          // 🔹 Initial state for smooth transition
          fireImage.style.opacity = "0";
          fireImage.style.transform = "scale(0.5)";
          fireImage.style.transition = "opacity 0.3s ease-in-out, transform 0.3s ease-in-out";

          document.querySelector(".game-container").appendChild(fireImage);

          // 🔹 Trigger fade-in effect after a short delay
          setTimeout(() => {
            fireImage.style.opacity = "1";
            fireImage.style.transform = "scale(1)";
          }, 50);

          hitSound.play();

          // 🔹 Remove image smoothly
          setTimeout(() => {
            fireImage.style.opacity = "0";
            fireImage.style.transform = "scale(0.5)";
            setTimeout(() => fireImage.remove(), 300); // Remove after fade-out
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
