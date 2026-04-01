import React, { useState } from "react";
import "./App.css";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState("");
  const [loading, setLoading] = useState(false);

  const submitLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setAlert("Both email and password are required");
      return;
    }
    setLoading(true);
    setAlert("");
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        onLogin(data.user);
      } else {
        setAlert(data.message || "Login failed");
      }
    } catch {
      setAlert("Cannot reach server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Rozgar Pakistan</h1>
        <p className="subtitle">E-Resume Builder Portal</p>
        <form onSubmit={submitLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-login">
            {loading ? "Logging in..." : "Login"}
          </button>
          {alert && <p className="message error">{alert}</p>}
        </form>
        <div className="demo-info">
          <p>Demo:</p>
          <p>Email: ali.raza@email.com</p>
          <p>Password: password123</p>
        </div>
      </div>
    </div>
  );
}