import { Routes, Route, BrowserRouter as Router, useNavigate } from "react-router-dom";
import { useState } from "react";
import RegisterForm from "./pages/RegisterPage";
import Gun from "./components/Gun";
import "./style/game.css";

const App = () => {
  const [email, setEmail] = useState(null);
  const navigate = useNavigate();

  const handleRegister = (userEmail) => {
    setEmail(userEmail);
    navigate('/game');  // Navigate to the game page once the user is registered
  };

  return (
    <div className="game-container">
      <Routes>
        <Route path="/" element={<RegisterForm onRegister={handleRegister} />} />
        <Route path="/game" element={<Gun email={email} onShoot={() => {}} />} />
      </Routes>
    </div>
  );
};

export default App;
