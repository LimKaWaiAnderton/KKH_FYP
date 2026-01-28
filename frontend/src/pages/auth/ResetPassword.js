import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import "../../styles/Auth/Login.css";
import logo from "../../assets/kkh.webp";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Validation
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || "Failed to reset password");
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

      {/* Reset Password Card */}
      <form className="login-card" onSubmit={handleSubmit}>
        <h2 style={{ marginBottom: '8px', fontSize: '24px', fontWeight: '600' }}>
          Reset Password
        </h2>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>
          Enter your new password below.
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
            <br />
            <span style={{ fontSize: '12px' }}>Redirecting to login...</span>
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
          <LockOutlinedIcon className="icon" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password (min 8 characters)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={loading || !token}
            minLength={8}
          />
          {!showPassword ? (
            <VisibilityOffOutlinedIcon
              className="icon"
              onClick={() => setShowPassword(true)}
              style={{ cursor: 'pointer' }}
            />
          ) : (
            <VisibilityOutlinedIcon
              className="icon"
              onClick={() => setShowPassword(false)}
              style={{ cursor: 'pointer' }}
            />
          )}
        </div>

        <div className="input-group">
          <LockOutlinedIcon className="icon" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading || !token}
          />
          {!showConfirmPassword ? (
            <VisibilityOffOutlinedIcon
              className="icon"
              onClick={() => setShowConfirmPassword(true)}
              style={{ cursor: 'pointer' }}
            />
          ) : (
            <VisibilityOutlinedIcon
              className="icon"
              onClick={() => setShowConfirmPassword(false)}
              style={{ cursor: 'pointer' }}
            />
          )}
        </div>

        <div className="login-actions">
          <button 
            type="submit" 
            className="login-btn"
            disabled={loading || !token}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button
            type="button"
            onClick={() => navigate('/login')}
            style={{
              background: 'none',
              border: 'none',
              color: '#0b5ed7',
              cursor: 'pointer',
              fontSize: '14px',
              textDecoration: 'underline'
            }}
          >
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
}
