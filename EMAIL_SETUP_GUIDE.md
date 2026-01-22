# Email Setup Guide - KKH Portal AddUser Feature

## Overview
The AddUser feature has been enhanced with robust email sending capabilities. This guide walks you through verifying the setup and troubleshooting any issues.

---

## ✅ What's Been Implemented

### Backend Email Infrastructure
- ✅ Nodemailer configured with Gmail SMTP
- ✅ Transporter verification on server startup
- ✅ Async/await email sending (blocks until complete)
- ✅ Plain text + detailed console logging
- ✅ Comprehensive error handling with specific troubleshooting tips
- ✅ Fallback password logging to console if email fails

### Frontend AddUser Component
- ✅ Form validation (required fields)
- ✅ Password generation on server (never exposed to frontend)
- ✅ User creation with all fields
- ✅ Email status feedback to user
- ✅ Auto-refresh TeamList after user creation
- ✅ Loading and error states

### Database Integration
- ✅ User creation with hashed password
- ✅ Department and role assignment
- ✅ Mobile number storage
- ✅ Active status tracking

---

## 🔧 Setup Steps

### Step 1: Verify Backend Configuration
1. Open `backend/.env`
2. Confirm these variables are set:
   ```
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-char-app-password
   ```

### Step 2: Enable 2-Step Verification on Gmail
1. Go to: https://myaccount.google.com/security
2. In the left navigation, click "2-Step Verification"
3. If not enabled, click "Get Started" and follow the steps

### Step 3: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. You must have 2FA enabled (Step 2 above)
3. Select: "Mail" and "Windows Computer" (or your device)
4. Click "Generate"
5. Copy the 16-character password (it will show with spaces, remove them)
6. Update `EMAIL_PASS` in `backend/.env` with this password

### Step 4: Restart Backend Server
```bash
cd backend
npm start  # or ctrl+c and restart if already running
```

Look for this message on startup:
```
✅ Email transporter created
✅ SMTP connection verified successfully!
   Ready to send emails to: users@your-domain.com
```

---

## 🧪 Testing Email Configuration

### Test Method 1: Use the Test Email Endpoint
1. Make sure your backend is running on port 5000
2. Get a valid JWT token (from a successful login)
3. Make a GET request to: `http://localhost:5000/auth/test-email`
   - Headers: `Authorization: Bearer your-jwt-token`
4. Check the response for success/error details

### Test Method 2: Add a Test User
1. Go to Manager → TeamList → "Add New User"
2. Fill in form with test data:
   - Name: Test User
   - Email: your-personal-email@gmail.com
   - Mobile: 0123456789
   - Department: Select any
   - Role: Select Employee or Admin
3. Click "Add User"
4. Check for success message
5. Check your email inbox for welcome message
6. If not received within 2 minutes, check server console for errors

---

## ❌ Troubleshooting

### Issue: "Email not configured" on startup

**Cause:** Missing or invalid EMAIL_USER or EMAIL_PASS

**Solution:**
1. Verify `backend/.env` has EMAIL_USER and EMAIL_PASS
2. Verify no quotes around values in `.env`
3. Restart server
4. Look for configuration message on startup

### Issue: EAUTH Error (Invalid login: 535-5.7.8)

**Cause:** Gmail credentials are wrong, expired, or 2FA not properly configured

**Solution:**
1. Verify 2FA is enabled: https://myaccount.google.com/security
2. Generate NEW App Password: https://myaccount.google.com/apppasswords
3. Make sure you're using App Password, NOT your Gmail password
4. Copy carefully (remove spaces): should be 16 characters
5. Update `backend/.env`
6. Restart server
7. Test with the test email endpoint

### Issue: Email sends in test but not in AddUser

**Cause:** Race condition in response timing (unlikely with async/await implementation)

**Solution:**
1. Check server console output for any errors after "Attempting to send welcome email..."
2. Verify the email address being sent to is valid
3. Check spam/junk folder
4. Wait 2+ minutes for delivery

### Issue: "Email could not be sent. Password logged to server console"

**Cause:** Email service failed, but user was still created (fallback working!)

**Solution:**
1. Check server console for password (search for "===")
2. Manually send the password to the user via secure channel
3. Fix the email configuration (see EAUTH troubleshooting)
4. Test again with the test endpoint

### Issue: User created but TeamList not updating

**Cause:** Refresh mechanism not triggered

**Solution:**
1. Manually refresh the page (F5)
2. Check browser console for errors
3. Verify user is in database: `SELECT * FROM users WHERE email='test@example.com';`

---

## 📋 Email Message Format

Users will receive emails like this:
```
Welcome to KKH Portal

Dear [FirstName],

Your user account has been successfully created.

LOGIN DETAILS:
Email: user@example.com
Temporary Password: xxxxxxxxxxxxxxxx

IMPORTANT:
Please change your password immediately after your first login.

If you did not request this account, please contact your administrator.

---
KKH Administration Team
Do not reply to this email.
```

---

## 🔒 Security Notes

- ✅ Passwords are generated server-side (16 random characters)
- ✅ Passwords are hashed with bcrypt before storage
- ✅ Plaintext passwords are NEVER sent to frontend
- ✅ Plaintext passwords are NEVER logged except to console (console is server-side only)
- ✅ Email credentials stored in `.env` (not in code)
- ✅ All protected endpoints require valid JWT token
- ✅ Email contains no sensitive info besides temp password

---

## 📊 Current Status

### Working
- ✅ User creation form
- ✅ Password generation & hashing
- ✅ Database storage
- ✅ TeamList auto-refresh
- ✅ Form validation & error handling

### Requires Gmail Credentials
- 🔴 Email sending (waiting for valid App Password)
- 🔴 Welcome emails to new users
- 🔴 Test email endpoint

**Next Step:** Follow Steps 2-3 above to generate and update your App Password

---

## 📞 Additional Resources

- Gmail App Passwords: https://myaccount.google.com/apppasswords
- Gmail Security: https://myaccount.google.com/security
- Nodemailer Docs: https://nodemailer.com/
- Node.js bcrypt: https://www.npmjs.com/package/bcrypt

---

## 📝 Log Indicators

When checking server console, look for these indicators:

| Symbol | Meaning |
|--------|---------|
| ✅ | Success (email sent, transporter verified) |
| ❌ | Error (email failed, config invalid) |
| 📧 | Email action (sending, received, etc) |
| 🔑 | Password related (generated, logged) |
| 👤 | User related (created, login, etc) |
| 🔍 | Information/debugging (startup checks) |
| 🔧 | Troubleshooting tip or solution |
| ⚠️ | Warning (fallback used, config missing) |

---

**Created:** [Email Setup Integration]  
**Last Updated:** Current Session  
**Status:** Ready for Gmail credential configuration
