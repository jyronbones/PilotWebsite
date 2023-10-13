import React from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/home"); // Navigate to the home page
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form
        className="login-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <div className="input-group">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" required />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>

        <div className="actions">
          <button type="submit" className="login-btn">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
