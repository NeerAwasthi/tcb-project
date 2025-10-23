// frontend/src/components/LoginPage.jsx
import React, { useState } from "react";
import api from "../services/api";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/users/login", { email, password });
      onLogin(data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <form className="note-form glass" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
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
          {loading ? "Logging in…" : "Login"}
        </button>
        <p className="hint" style={{ marginTop: "10px" }}>
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;