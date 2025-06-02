import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import { API_BASE } from "../api/config";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE}/forgot-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password reset link has been sent to your email.");
        setError("");
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Unable to connect to the server. Please try again later.");
    }
  };

  return (
    <>
      <div className="flex justify-center my-10 mx-2 pb-10">
        <div className="p-8 bg-card-border-2 rounded-lg w-full max-w-sm">
          <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
          <p className="text-sm text-center text-gray-600 mb-4">
            Enter your email and we'll send you a password reset link.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-10">
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
            {message && <p className="text-green-500 text-sm mb-4">{message}</p>}
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button type="submit" className="login-btn-container login-btn w-full">
              Send Reset Link
            </button>
          </form>
          <div className="flex flex-col items-center text-center mt-5">
            <Link to="/login" className="navbar-links mt-2">
              Back to Login
            </Link>
            <Link to="/register" className="navbar-links mt-2">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ForgotPassword;