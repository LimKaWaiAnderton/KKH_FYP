import { useState } from "react";
import "../../styles/Auth/Login.css";
import logo from "../../assets/kkh.webp";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("http://localhost:5000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setEmail(""); // Clear email field
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Logo */}
      <img src={logo} alt="KKH Logo" className="login-logo" />

      {/* Forgot Password Card */}
      <form className="login-card" onSubmit={handleSubmit}>
        <button 
          type="button" 
          onClick={() => navigate('/login')}
          style={{
            background: 'none',
            border: 'none',
            color: '#666',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px',
            fontSize: '14px'
          }}
        >
          <ArrowBackIcon style={{ fontSize: '18px' }} />
          Back to Login
        </button>

        <h2 style={{ marginBottom: '8px', fontSize: '24px', fontWeight: '600' }}>
          Forgot Password?
        </h2>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {message && (
          <div style={{
            padding: '12px',
            backgroundColor: '#d4edda',
            color: '#155724',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {message}
          </div>
        )}

        {error && (
          <div style={{
            padding: '12px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <div className="input-group">
          <EmailOutlinedIcon className="icon" />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="login-actions">
          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </div>
      </form>
    </div>
  );
}
