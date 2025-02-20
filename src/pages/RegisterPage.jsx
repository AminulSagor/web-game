import React, { useState } from "react";
import { registerUser } from "../services/api";
import { validateEmail} from "../utils/validation";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email.trim() === "") {
      setError("Email cannot be empty");
      return;
    }
  
  
    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }
  
    try {
      await registerUser({ name: name || email.split("@")[0], email });
  
      localStorage.setItem("email", email); // ✅ Store email in localStorage
      navigate("/game"); // Redirect to game
    } catch (err) {
      setError("Error registering user");
      console.error(err);
    }
  };
  
  


  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",  // ✅ Full width of the viewport
        height: "100vh", // ✅ Full height of the viewport
        backgroundColor: "#f0f0f0" ,  // Light blue

        margin: "0", // Ensure no margin issues affect centering
      }}
    >
      <div
        style={{
          background: "white",
          padding: "30px 30px 30px 30px", // Adjusted padding
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          width: "350px",
          textAlign: "center",
          display: "flex", // Ensure form contents are vertically aligned
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h2 style={{ marginBottom: "15px", fontSize: "22px", color: "#333" }}>
          Register
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
        >
          <input
            type="text"
            placeholder="Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              fontSize: "16px",
              transition: "0.3s",
            }}
          />
          <input
            type="text" // Changed from type="email" to type="text" to remove default HTML validation
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              fontSize: "16px",
              transition: "0.3s",
            }}
          />
          
          {error && (
            <p style={{ color: "red", fontSize: "14px", marginTop: "10px" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            style={{
              width: "80%", // Adjust width as needed
              padding: "12px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
