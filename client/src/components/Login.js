import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // authenticating user with the backend
      const res = await axios.post("https://ai-customer-support-d7b5.onrender.com/auth/login", {
        username,
        password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);

      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;

      // according to the role, navigate to different pages
      if (role === "admin") navigate("/upload");
      else navigate("/chat");
    } catch (err) {
      setError("Invalid credentials");
    }

  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <h1 className="absolute top-8 text-xl text-center font-semibold text-gray-700">
        👋🏻 Welcome To Login Page
      </h1>
      <div className="bg-white shadow-2xl rounded-2xl px-10 py-8 w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-bold italic mb-2">AI Customer Support</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>
        <div className="space-y-4">
          <label for="username" className="font-semibold">Username</label>
          <input
            placeholder="enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <label for="password" className="font-semibold">Password</label>
          <input
            type="password"
            placeholder="enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleLogin}
            className="w-full cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition"
          >
            Login
          </button>
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default Login;
