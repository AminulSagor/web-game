import React, { useState, useEffect } from "react";
import Gun from "./Gun"; // Desktop version (keeping the name as is)
import GunMobile from "./GunMobile"; // Mobile version

const GunManager = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? <GunMobile /> : <Gun />;
};

export default GunManager;
