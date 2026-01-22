# AddUser Feature - Quick Reference

## 🚀 Quick Start Checklist

- [ ] Enable 2FA on Gmail: https://myaccount.google.com/security
- [ ] Generate App Password: https://myaccount.google.com/apppasswords
- [ ] Update `backend/.env` with new EMAIL_PASS (16 chars, no spaces)
- [ ] Restart backend: `npm start`
- [ ] Check startup logs for "✅ SMTP connection verified successfully!"
- [ ] Test email: GET `http://localhost:5000/auth/test-email` (with JWT token)
- [ ] Try adding a user via UI
- [ ] Verify email received in inbox

---

## 🔌 API Endpoints

### Create User (with auto-email)
```
POST /auth/add-user
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "department_id": 1,
  "role_id": 2,
  "mobile_number": "0123456789"
}

Response (201):
{
  "message": "User added successfully. Welcome email sent to john@example.com",
  "user": { /* user object */ },
  "emailSent": true
}
```

### Test Email Configuration
```
GET /auth/test-email
Authorization: Bearer <JWT_TOKEN>

Response (200):
{
  "success": true,
  "message": "Test email sent successfully!",
  "messageId": "...",
  "recipient": "simcimin1412@gmail.com",
  "sender": "your-email@gmail.com"
}

Response (500) if error:
{
  "success": false,
  "message": "Failed to send test email",
  "error": "Invalid login: 535-5.7.8",
  "code": "EAUTH",
  "tips": [
    "Check EMAIL_USER and EMAIL_PASS in .env",
    "Verify 2FA is enabled on Gmail account",
    "Generate new App Password from https://myaccount.google.com/apppasswords",
    "Ensure no spaces in the 16-character App Password"
  ]
}
```

### Get All Users
```
GET /auth/users
Authorization: Bearer <JWT_TOKEN>

Response:
[
  {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "role_id": 2,
    "mobile_number": "0123456789",
    "is_active": true,
    "department_name": "Operations"
  },
  ...
]
```

---

## 📧 Email Flow

```
User fills form → Submit
    ↓
Frontend validates → POST /auth/add-user
    ↓
Backend validates → Check duplicate email
    ↓
Generate password (16 chars) → Hash with bcrypt
    ↓
Insert into database
    ↓
Send welcome email (await)
    ├─ SUCCESS: Return 201 with emailSent: true
    └─ FAIL: Log password to console, return 201 with emailSent: false
    ↓
Frontend: Show success message
    ↓
After 2 seconds: Navigate to TeamList with refresh=true
    ↓
TeamList: Fetch users → Display updated list
```

---

## 🔍 Server Console Indicators

When running the backend, watch for:

**Startup:**
```
📧 Email Configuration Check:
   EMAIL_USER: nico...@gmail.com
   EMAIL_PASS: 16 characters
   EMAIL_SERVICE: gmail
✅ Email transporter created
✅ SMTP connection verified successfully!
```

**User Creation Success:**
```
👤 Creating user: John Doe (john@example.com)
🔑 Generated temporary password (length: 16)
📧 Sending welcome email to: john@example.com
   Recipient Name: John
   From: nico.sim.ci.min@gmail.com
✅ Email sent successfully!
   Message ID: <some-id>
   Status: 250 2.0.0 OK
✅ User creation completed successfully with email sent.
```

**User Creation with Email Failure:**
```
👤 Creating user: Jane Doe (jane@example.com)
🔑 Generated temporary password (length: 16)
📧 Sending welcome email to: jane@example.com
❌ FAILED TO SEND EMAIL
   Recipient: jane@example.com
   Error: Invalid login: 535-5.7.8
   Code: EAUTH
   
   🔧 AUTHENTICATION ERROR
      The EMAIL_USER and EMAIL_PASS credentials are invalid.
      Steps to fix:
      1. Go to: https://myaccount.google.com/security
      2. Verify 2-Step Verification is enabled
      3. Go to: https://myaccount.google.com/apppasswords
      4. Generate a NEW App Password...

📧 FALLBACK: PASSWORD LOGGED TO CONSOLE
   👤 User: Jane
   📧 Email: jane@example.com
   🔑 Password: abcdefghijklmnop
⚠️  Manually share this password with the user.

⚠️  User creation completed but email failed. Check logs above.
```

---

## 🧪 Testing Workflow

### Test 1: Email Configuration
```bash
# With JWT token from login:
GET http://localhost:5000/auth/test-email
Authorization: Bearer <your_jwt_token>
```
Expected: Success message or specific EAUTH troubleshooting

### Test 2: Add Real User
1. Go to Manager → Team List
2. Click "Add New User"
3. Fill form:
   - Name: Test User
   - Email: your-personal@gmail.com
   - Mobile: 0123456789
   - Dept: Any
   - Role: Any
4. Click "Add User"
5. Check success message
6. Wait 30-60 seconds
7. Check your email inbox & spam folder

### Test 3: Verify TeamList Updates
1. After successful user creation, page should show success
2. After 2 seconds, auto-navigate to TeamList
3. New user should appear in the appropriate list (Admins or Members)
4. If not: F5 to refresh, check browser console for errors

---

## ⚠️ Known Limitations

- Emails may take 1-2 minutes to arrive (Gmail processing)
- Temporary password is 16 random characters (users should change immediately)
- If email fails, password is logged to server console (admin can share manually)
- Password is never shown in UI or API response
- Test email endpoint sends to hardcoded address (for debugging only)

---

## 🔐 Security Checklist

- ✅ Passwords generated server-side (not frontend)
- ✅ Passwords hashed with bcrypt before database storage
- ✅ Credentials in .env (not in code)
- ✅ Email credentials use App Password (not main Gmail password)
- ✅ All endpoints protected with JWT middleware
- ✅ Plaintext passwords logged only to server console (not network)
- ✅ No passwords in API responses
- ✅ No passwords in browser console or logs

---

## 📚 File Locations

- Frontend Form: `frontend/src/pages/manager/AddUser.js`
- Backend Controller: `backend/controllers/auth.controller.js`
- Backend Routes: `backend/routes/auth.route.js`
- Configuration: `backend/.env`
- Server Entry: `backend/server.js`
- Full Guide: `EMAIL_SETUP_GUIDE.md`

---

## 🎯 Next Steps

1. **Get App Password:** Go to https://myaccount.google.com/apppasswords
2. **Update Config:** Update EMAIL_PASS in `backend/.env`
3. **Restart Server:** Stop and restart `npm start` in backend folder
4. **Test:** Run test email endpoint or add a test user
5. **Verify:** Check your email inbox for welcome message
6. **Deploy:** Once verified working, feature is production-ready

---

**Note:** Test email endpoint is temporary for debugging. Remove after email is confirmed working.
