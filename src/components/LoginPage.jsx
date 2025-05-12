import React, { useState } from "react";
import { Link } from 'react-router-dom'
import Footer from './Footer'

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(localStorage.getItem("rememberMe") === "true");


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);

        // Store username if "Remember Me" is checked
        if (rememberMe) {
          localStorage.setItem("rememberUsername", username);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberUsername");
          localStorage.removeItem("rememberMe");
        }

        window.location.href = "/browsetask";
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    }
  };
  
  return (
    <>
    <div className="flex justify-center my-10 mx-2 pb-10">
      <div className="p-8 bg-card-border-2 rounded-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label 
              htmlFor="username" 
              className="block font-medium mb-2"
            >
              Username
            </label>
            <input 
              id="username" 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="w-full px-4 py-2 bg-input-card-border rounded-lg" 
              required 
            />
          </div>
          <div className="mb-4">
            <label 
              htmlFor="password" 
              className="block font-medium mb-2"
            >
              Password
            </label>
            <input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-4 py-2 bg-input-card-border rounded-lg" 
              required 
            />
          </div>

          {/* Add Remember Me Checkbox */}
          <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="mr-2"
              />
              <label htmlFor="rememberMe" className="font-medium">
                Remember Me
              </label>
            </div>

          <div className="py-5">
            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}
            <button
              type="submit"
              className="login-btn-container login-btn w-full"
            >
              Login
            </button>
          </div>
        </form>
        <div className="flex flex-col items-center text-center mt-4">
          <Link
            to="/forgotpass"
            className="navbar-links mt-2"
          >
            Forgot Password?
          </Link>
          <Link
            to="/register"
            className="navbar-links mt-2"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default LoginPage;