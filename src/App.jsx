import { Routes, Route, BrowserRouter as Router, useNavigate } from "react-router-dom";
import { useState } from "react";
import RegisterForm from "./pages/RegisterPage";
import ChooseCharacter from "./pages/ChooseCharacter";
import GunManager from "./components/GunManager"; // Wrapper for dynamic switching
import "./style/game.css";
import AdminPage from './pages/AdminPage';

const App = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(localStorage.getItem("email") || null);

  const handleRegister = (userEmail) => {
    setEmail(userEmail);
    localStorage.setItem("email", userEmail);
    navigate('/game');
  };

  return (
    <Routes>
      <Route path="/" element={<RegisterForm onRegister={handleRegister} />} />
      <Route path="/choose-character" element={<ChooseCharacter />} />
      <Route path="/game" element={<GunManager />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
};

export default App;
