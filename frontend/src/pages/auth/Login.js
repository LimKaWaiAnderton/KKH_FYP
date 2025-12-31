import { useState } from "react";
import "../../styles/Auth/Login.css";
import logo from "../../assets/kkh.webp"; // put logo here

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    localStorage.setItem("token", data.token);

    if (data.role === "admin") {
      window.location.href = "/manager/requests/leave";
    } else {
      window.location.href = "/employee/requests/shift";
    }
  };



  return (
    <div className="login-page">
      {/* Logo */}
      <img src={logo} alt="KKH Logo" className="login-logo" />

      {/* Login Card */}
      <form className="login-card" onSubmit={handleSubmit}>

        <div className="input-group">
          <span className="icon">👤</span>
          <input
            type="text"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <span className="icon">🔒</span>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>



        <div className="login-options">
          <label>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Remember me
          </label>

          <span className="forgot">Forgot Password?</span>
        </div>

        <div className="login-actions">
          <button type="submit" className="login-btn">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
