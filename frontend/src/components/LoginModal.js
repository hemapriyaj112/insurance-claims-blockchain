import React, { useState } from "react";
import "./Form.css";
 // reuse modal styles

function LoginModal({ onClose, onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignup) {
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      // signup logic (demo only)
      const newUser = { email };
      onLogin(newUser);
    } else {
      // login logic (demo only)
      const user = { email };
      onLogin(user);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h2>{isSignup ? "Create Account" : "Login"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {isSignup && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}

          <button type="submit" className="submit-btn">
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <p style={{ marginTop: "1rem" }}>
          {isSignup ? "Already have an account?" : "New user?"}{" "}
          <span
            className="link-text"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Login here" : "Create an account"}
          </span>
        </p>

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default LoginModal;
