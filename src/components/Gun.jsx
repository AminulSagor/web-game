// src/components/Gun.jsx
import React, { useState } from "react";
import { Howl } from "howler";
import "../style/game.css";

const gunfireSound = new Howl({
  src: ["/assets/gun-fire.mp3"],
});

const Gun = ({ onShoot }) => {
  const [shooting, setShooting] = useState(false);

  const handleShoot = () => {
    setShooting(true);
    gunfireSound.play();
    setTimeout(() => setShooting(false), 200);
    onShoot();
  };

  return (
    <div className={`gun-container ${shooting ? "shooting" : ""}`} onClick={handleShoot}>
      <div className="gun-body">
        <div className="gun-barrel"></div>
        <div className="gun-trigger"></div>
        <div className="gun-grip"></div>
        <div className={`muzzle-flash ${shooting ? "flash" : ""}`}></div>
      </div>
    </div>
  );
};

export default Gun;
