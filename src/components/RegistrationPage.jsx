import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from './Footer'


const RegistrationPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, confirm_password: confirmPassword }), // ✅ Include confirm_password
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setSuccess(data.message);
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setError("");
  
        localStorage.setItem("authToken", data.token);

        // Wait 2 seconds and navigate to login
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Unable to connect to the server.");
    }
  };


  return (
    <>
      <div className="flex justify-center my-10 mx-2 pb-10">
        <div className="p-8 bg-card-border-2 rounded-lg w-full max-w-sm">
          <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label htmlFor="username" className="block font-medium mb-2">
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
              <label htmlFor="email" className="block font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-input-card-border rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block font-medium mb-2">
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
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block font-medium mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 bg-input-card-border rounded-lg"
                required
              />
            </div>
            <div className="pt-10 pb-5">
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

              <button type="submit" className="login-btn-container login-btn w-full">
                Sign Up
              </button>
            </div>
          </form>
          <div className="text-center mt-4">
            <a href="/login" className="text-blue-500 hover:underline block mt-2">
              Already have an account? Log In
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RegistrationPage;