// src/components/Register.js
import { useState } from "react";
import axios from "axios";

function Register({ setToken }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/auth/register", {
        name,
        email,
        password,
      });
      const tokenResponse = await axios.post(
        "http://localhost:3000/auth/login",
        {
          email,
          password,
        }
      );
      setToken(response.data.token); // Set token after successful registration
    } catch (error) {
      console.error("Registration error:", error.response.data);
    }
  };

  return (
    <form onSubmit={handleRegister} className="auth-form">
      <input
        type="text"
        placeholder="Full Name"
        onChange={(e) => setName(e.target.value)}
        value={name}
        required
      />
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        required
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        required
      />
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
