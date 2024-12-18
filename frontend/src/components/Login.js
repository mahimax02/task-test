import React, { useState } from "react";
import "../styles/Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:8080/api/login?username=${username}&password=${password}`
      );

      if (response.status === 200) {
        console.log("Response status:", response.status);
        
        // Extract API key from the response message
        const apiKey = response.data.split(": ")[1];
        console.log("Extracted API Key:", apiKey);

        // Store the API key in local storage
        localStorage.setItem("apiKey", apiKey);

        // Check if the key was stored correctly
        const storedApiKey = localStorage.getItem("apiKey");
        console.log("Stored API Key:", storedApiKey);

        alert("Login successful!");
        navigate("/dashboard"); // Redirect upon success
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || "Login failed!");
      } else {
        console.error("Error:", error);
        alert("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account?{" "}
        <span
          className="registration-link"
          onClick={() => navigate("/register")}
        >
          Register Here
        </span>
      </p>
    </div>
  );
};

export default Login;
