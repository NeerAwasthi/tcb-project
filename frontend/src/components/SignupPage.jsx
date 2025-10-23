// frontend/src/components/SignupPage.jsx
import React, { useState } from "react";
import api from "../services/api";

const SignupPage = ({ onLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/users/register", { name, email, password });
      onLogin(data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <form className="note-form glass" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
        <input
          className="input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          className="input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button className="btn primary" type="submit" disabled={loading}>
          {loading ? "Signing up…" : "Sign Up"}
        </button>
         <p className="hint" style={{ marginTop: "10px" }}>
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;