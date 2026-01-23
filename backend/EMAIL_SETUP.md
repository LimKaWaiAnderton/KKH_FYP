# Email Setup Instructions

The application now sends welcome emails to newly created users with their temporary passwords.

## Required Setup

### 1. Install Nodemailer
```bash
npm install nodemailer
```

### 2. Configure Email Service

Update the `.env` file in the `backend` directory with your email credentials:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 3. Email Service Options

#### Option A: Gmail (Recommended for Development)

1. Use a Gmail account
2. Enable 2-Factor Authentication on your Google account
3. Generate an App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the generated 16-character password
   - Use this password in `EMAIL_PASS` (not your regular Gmail password)

#### Option B: Other Email Services

You can use other email services by changing the `EMAIL_SERVICE`:

**Outlook/Hotmail:**
```env
EMAIL_SERVICE=hotmail
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

**Custom SMTP:**
```javascript
// In auth.controller.js, replace the transporter config with:
const transporter = nodemailer.createTransport({
  host: "smtp.your-domain.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

### 4. Email Template

The welcome email includes:
- User's email address
- Temporary password (generated automatically)
- Instructions to change password on first login

### 5. Testing

To test the email functionality:

1. Start the backend server:
   ```bash
   npm run dev
   ```

2. Create a new user from the frontend
3. Check the recipient's inbox for the welcome email

### Security Notes

⚠️ **Important Security Practices:**

- Never commit `.env` file to version control
- Use App Passwords instead of regular account passwords
- Passwords are automatically hashed before being stored in the database
- Temporary passwords are NOT logged or displayed in the frontend
- Email sending happens asynchronously to avoid blocking user creation

### Troubleshooting

**Email not sending?**
- Check your email credentials in `.env`
- Verify 2FA and App Password are set up correctly
- Check backend console for email sending errors
- Ensure firewall allows SMTP connections (port 587 for Gmail)

**Gmail "Less secure app" error?**
- Don't use "Allow less secure apps" setting
- Use App Passwords instead (requires 2FA)

**Testing without real email:**
- Comment out the `sendWelcomeEmail()` call in `auth.controller.js`
- The temporary password will be logged to console instead
