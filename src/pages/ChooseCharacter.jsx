import React from "react";
import { useNavigate } from "react-router-dom";

const ChooseCharacter = () => {
  const navigate = useNavigate();

  const handleCharacterSelection = (character) => {
    localStorage.setItem("character", character); // ✅ Save choice in localStorage
    navigate("/game"); // ✅ Start game after selecting character
  };

  return (
    <>
      {/* ✅ Inline CSS inside JSX */}
      <style>
        {`
          /* ✅ Default (Desktop) Styles */
          .choose-character-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            width: 100vw;
            background-color: #f0f0f0;
          }

          .choose-character-title {
            margin-bottom: 20px;
            font-size: 32px;
            color: #333;
            font-weight: bold;
            text-align: center;
          }

          .character-selection {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 50px;
            width: 100%;
          }

          /* ✅ Character Box */
          .character-box {
            cursor: pointer;
            text-align: center;
            padding: 30px;
            border-radius: 10px;
            background-color: white;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
            width: 300px;
            height: 350px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s ease-in-out;
          }

          .character-box:hover {
            transform: scale(1.05);
          }

          /* ✅ Character Image */
          .character-image {
            width: 250px;
            height: auto;
          }

          /* ✅ Character Name */
          .character-name {
            margin-top: 10px;
            font-size: 24px;
          }

          /* ✅ Mobile Responsive Styles */
          @media (max-width: 768px) {
            .character-selection {
              flex-direction: column; /* ✅ Stack characters vertically */
              gap: 20px; /* ✅ Reduce space between characters */
            }

            .character-box {
              width: 90%; /* ✅ Make character box fit screen width */
              max-width: 250px; /* ✅ Prevent it from being too large */
              height: auto; /* ✅ Allow height to adjust */
              padding: 20px; /* ✅ Reduce padding */
            }

            .character-image {
              width: 180px; /* ✅ Reduce image size */
            }

            .character-name {
              font-size: 20px; /* ✅ Reduce text size */
            }

            .choose-character-title {
              font-size: 24px; /* ✅ Reduce heading size */
            }
          }
        `}
      </style>

      <div className="choose-character-container">
        <h2 className="choose-character-title">Choose a Character to Play With</h2>

        <div className="character-selection">
          
          {/* Allen Character */}
          <div 
            className="character-box"
            onClick={() => handleCharacterSelection("Allen")}
          >
            <img src="/assets/Allen_Fire.png" alt="Allen" className="character-image" />
            <h3 className="character-name">Allen</h3>
          </div>

          {/* Shaila Character */}
          <div 
            className="character-box"
            onClick={() => handleCharacterSelection("Shaila")}
          >
            <img src="/assets/Shaila_Fall.png" alt="Shaila" className="character-image" />
            <h3 className="character-name">Shaila</h3>
          </div>

        </div>
      </div>
    </>
  );
};

export default ChooseCharacter;
