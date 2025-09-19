import React, { useState } from "react";
import "./Form.css";

const AuthModal = ({ onClose, onLogin, onSignup }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter all fields");
      return;
    }
    if (isLogin) {
      onLogin({ email });
    } else {
      onSignup({ email });
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h2>{isLogin ? "Login" : "Create Account"}</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="submit-btn">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          {isLogin ? "New user?" : "Already have an account?"}{" "}
          <span
            className="link-text"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Create Account" : "Login"}
          </span>
        </p>

        <button className="close-btn" onClick={onClose}>
          ✖ Close
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
