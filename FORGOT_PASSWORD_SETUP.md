# Forgot Password Feature Setup Guide

## ✅ What Was Implemented

A complete "Forgot Password" self-service feature that allows users to reset their passwords via email.

### Features:
- ✅ "Forgot Password?" link on login page
- ✅ User enters email → receives reset link
- ✅ Secure token-based password reset (expires in 1 hour)
- ✅ One-time use tokens
- ✅ Email notifications (if configured)
- ✅ Console fallback (if email not configured)

---

## 🚀 Setup Instructions

### Step 1: Update Database Schema

Run the SQL migration to add the password reset tokens table:

```bash
# Option A: Run the migration file
psql -U postgres -d KKH_FYP -f backend/sql/add_password_reset_table.sql

# Option B: Or re-run the full schema (will drop existing data)
psql -U postgres -d KKH_FYP -f backend/sql/schema.sql
```

### Step 2: Install Dependencies (if needed)

The `crypto` module is built into Node.js, so no new dependencies are needed! ✅

### Step 3: Restart Backend Server

```bash
cd backend
npm run dev
```

### Step 4: (Optional) Configure Email

To send actual emails instead of console logs, add these to your `.env` file:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
EMAIL_SERVICE=gmail
```

**How to get Gmail App Password:**
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Go to https://myaccount.google.com/apppasswords
4. Generate an App Password for "Mail"
5. Copy the 16-character password (no spaces)
6. Add to `.env` file
7. Restart backend

---

## 📋 How to Use

### For Users:

1. **Go to login page** (`http://localhost:3000/login`)
2. **Click "Forgot Password?"**
3. **Enter email address**
4. **Check email** for reset link (or check backend console if email not configured)
5. **Click reset link** → opens reset password page
6. **Enter new password** (minimum 8 characters)
7. **Confirm password**
8. **Submit** → redirected to login

### For Testing (Without Email):

If email is not configured, the reset link will be logged to the **backend console**:

```
======================================================================
📧 FALLBACK: RESET LINK LOGGED TO CONSOLE
======================================================================
👤 User: John
📧 Email: john@kkh.com.sg
🔗 Reset Link: http://localhost:3000/reset-password?token=abc123...
======================================================================
```

Copy the reset link and paste it in your browser!

---

## 🔒 Security Features

- ✅ **Token-based authentication** (no passwords in URLs)
- ✅ **1-hour token expiration** (configurable)
- ✅ **One-time use tokens** (can't be reused)
- ✅ **Email verification** (proves user owns the account)
- ✅ **Password hashing** (bcrypt with 10 rounds)
- ✅ **Minimum password length** (8 characters)
- ✅ **No email disclosure** (doesn't reveal if email exists)

---

## 📁 Files Changed/Created

### Backend:
- ✅ `backend/sql/schema.sql` - Added password_reset_tokens table
- ✅ `backend/sql/add_password_reset_table.sql` - Migration file
- ✅ `backend/controllers/auth.controller.js` - Added forgotPassword & resetPassword functions
- ✅ `backend/routes/auth.route.js` - Added /forgot-password and /reset-password routes

### Frontend:
- ✅ `frontend/src/pages/auth/ForgotPassword.js` - New page
- ✅ `frontend/src/pages/auth/ResetPassword.js` - New page
- ✅ `frontend/src/pages/auth/Login.js` - Made "Forgot Password?" clickable
- ✅ `frontend/src/App.js` - Added routes

---

## 🧪 Testing Checklist

- [ ] Database migration applied successfully
- [ ] Backend server starts without errors
- [ ] Can access login page at http://localhost:3000/login
- [ ] "Forgot Password?" link is clickable
- [ ] Forgot Password page loads correctly
- [ ] Can submit email (existing or non-existing)
- [ ] Reset link appears in backend console (if email not configured)
- [ ] Reset password page loads from link
- [ ] Can set new password (min 8 chars)
- [ ] Password reset successful
- [ ] Can login with new password
- [ ] Token expires after 1 hour
- [ ] Token can't be reused

---

## 🎯 API Endpoints

### POST /auth/forgot-password
```json
Request:
{
  "email": "user@kkh.com.sg"
}

Response:
{
  "message": "If an account with that email exists, a password reset link has been sent.",
  "emailSent": true
}
```

### POST /auth/reset-password
```json
Request:
{
  "token": "abc123...",
  "newPassword": "newPassword123"
}

Response:
{
  "message": "Password reset successful. You can now login with your new password."
}
```

---

## 🐛 Troubleshooting

**Issue: "Invalid or expired reset token"**
- Token may have expired (1 hour limit)
- Token may have been used already
- Request a new password reset

**Issue: Reset link not received**
- Check backend console for the link
- Verify email configuration in `.env`
- Check spam folder

**Issue: Email not sending**
- Email is optional! The link will be in the backend console
- Follow EMAIL_SETUP.md to configure Gmail

---

## ✨ Next Steps (Optional Enhancements)

1. **Add "Change Password" in Settings** (for logged-in users)
2. **Force password change on first login** (for new accounts)
3. **Password strength indicator**
4. **Rate limiting** (prevent spam)
5. **Notification emails** (password changed successfully)

---

## 📞 Support

If you encounter any issues, check:
1. Backend console for error messages
2. Browser console for frontend errors
3. Database connection is working
4. All files are saved and server is restarted
