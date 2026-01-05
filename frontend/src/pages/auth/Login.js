import { useState } from "react";
import "../../styles/Auth/Login.css";
import logo from "../../assets/kkh.webp"; // put logo here

import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [showPassword, setShowPassword] = useState(false);

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

  const togglePasswordVisibility = () => {
    if (passwordType === "password") {
      console.log("show password");
      setPasswordType("text");
      setShowPassword(true);
    } else {
      console.log("hide password");
      setPasswordType("password");
      setShowPassword(false);
    }
  };


  return (
    <div className="login-page">
      {/* Logo */}
      <img src={logo} alt="KKH Logo" className="login-logo" />

      {/* Login Card */}
      <form className="login-card" onSubmit={handleSubmit}>

        <div className="input-group">
          <EmailOutlinedIcon
            className="icon" />
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <LockOutlinedIcon
            className="icon" />
          <input
            type={passwordType}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {!showPassword ?
            <VisibilityOffOutlinedIcon
              className="icon"
              onClick={togglePasswordVisibility} /> :
            <VisibilityOutlinedIcon
              className="icon"
              onClick={togglePasswordVisibility} />
          }
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
