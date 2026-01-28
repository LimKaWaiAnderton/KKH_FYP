import pool from "../db/pool.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";

// Log environment variables for debugging (on server startup)
console.log('\n🔍 Email Configuration Check:');
console.log('   EMAIL_USER:', process.env.EMAIL_USER ? `${process.env.EMAIL_USER.substring(0, 3)}***` : 'NOT SET');
console.log('   EMAIL_PASS:', process.env.EMAIL_PASS ? `${process.env.EMAIL_PASS.length} characters` : 'NOT SET');
console.log('   EMAIL_SERVICE:', process.env.EMAIL_SERVICE || 'gmail (default)');

// Check if email credentials are configured
const isEmailConfigured = () => {
  const hasCredentials = process.env.EMAIL_USER && process.env.EMAIL_PASS;
  const isNotPlaceholder = 
    process.env.EMAIL_USER !== 'your-email@gmail.com' && 
    process.env.EMAIL_PASS !== 'your-app-password';
  return hasCredentials && isNotPlaceholder;
};

// Configure email transporter with proper Gmail settings
let transporter = null;
if (isEmailConfigured()) {
  try {
    transporter = nodemailer.createTransport({
      service: "gmail", // Use Gmail service (handles host/port automatically)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    
    console.log('✅ Email transporter created');
    
    // Verify SMTP connection on startup
    transporter.verify((error, success) => {
      if (error) {
        console.error('❌ SMTP connection failed:', error.message);
        if (error.code === 'EAUTH') {
          console.error('   Authentication failed. Check:');
          console.error('   1. EMAIL_USER is correct Gmail address');
          console.error('   2. EMAIL_PASS is 16-char App Password (no spaces)');
          console.error('   3. 2FA is enabled on Google account');
        }
        transporter = null; // Disable transporter if verification fails
      } else {
        console.log('✅ SMTP server is ready to send emails\n');
      }
    });
  } catch (err) {
    console.error('❌ Failed to configure email transporter:', err.message);
    transporter = null;
  }
} else {
  console.warn('⚠️  Email not configured. Update EMAIL_USER and EMAIL_PASS in .env file.');
  console.warn('⚠️  Passwords will be logged to console instead.\n');
}

// Helper function to send welcome email with temporary password
const sendWelcomeEmail = async (email, firstName, tempPassword) => {
  // If email is not configured, log password to console
  if (!transporter || !isEmailConfigured()) {
    console.log('\n' + '='.repeat(70));
    console.log('📧 EMAIL NOT CONFIGURED - PASSWORD LOGGED TO CONSOLE');
    console.log('='.repeat(70));
    console.log(`👤 User: ${firstName}`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Temporary Password: ${tempPassword}`);
    console.log('='.repeat(70) + '\n');
    console.warn('⚠️  Configure EMAIL_USER and EMAIL_PASS in .env to send actual emails.');
    console.warn('⚠️  Run: node test-email.js to verify credentials\n');
    return { success: false, reason: 'Email not configured' };
  }

  try {
    console.log(`\n📧 Sending welcome email to: ${email}`);
    console.log(`   Recipient Name: ${firstName}`);
    console.log(`   From: ${process.env.EMAIL_USER}`);
    
    // Use plain text instead of HTML to avoid spam filters
    const emailText = `Welcome to KKH Portal

Dear ${firstName},

Your user account has been successfully created.

LOGIN DETAILS:
Email: ${email}
Temporary Password: ${tempPassword}

IMPORTANT:
Please change your password immediately after your first login.

If you did not request this account, please contact your administrator.

---
KKH Administration Team
Do not reply to this email.`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to KKH Portal - Your Temporary Password",
      text: emailText, // Plain text version (avoids spam filters)
      html: null, // Disable HTML to improve deliverability
    };

    // Send email with await to ensure it completes
    const info = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Email sent successfully!`);
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Status: ${info.response}`);
    console.log(`   Recipient will receive email within minutes.\n`);
    
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`\n❌ FAILED TO SEND EMAIL`);
    console.error(`   Recipient: ${email}`);
    console.error(`   Error: ${err.message}`);
    if (err.code) console.error(`   Code: ${err.code}`);
    if (err.command) console.error(`   Command: ${err.command}`);
    if (err.response) console.error(`   Response: ${err.response}`);
    
    // Provide specific troubleshooting tips based on error type
    if (err.code === 'EAUTH') {
      console.error('\n   🔧 AUTHENTICATION ERROR');
      console.error('      The Email_USER and EMAIL_PASS credentials are invalid.');
      console.error('      Steps to fix:');
      console.error('      1. Go to: https://myaccount.google.com/security');
      console.error('      2. Verify 2-Step Verification is enabled');
      console.error('      3. Go to: https://myaccount.google.com/apppasswords');
      console.error('      4. Generate a NEW App Password (select Mail & your device)');
      console.error('      5. Copy the 16-character password (no spaces)');
      console.error('      6. Update EMAIL_PASS in .env file');
      console.error('      7. Restart the backend server\n');
    } else if (err.code === 'ECONNECTION') {
      console.error('\n   🔧 CONNECTION ERROR');
      console.error('      Cannot reach Gmail SMTP server.');
      console.error('      Check: Internet connection, Firewall, Gmail SMTP not blocked\n');
    } else if (err.code === 'ENOTFOUND') {
      console.error('\n   🔧 DNS ERROR');
      console.error('      Cannot resolve Gmail server domain.');
      console.error('      Check: Internet connection, DNS settings\n');
    } else {
      console.error('\n   🔧 UNKNOWN ERROR');
      console.error('      Check .env EMAIL_USER and EMAIL_PASS are correct');
      console.error('      Run: node test-email.js to diagnose the issue\n');
    }
    
    // Fallback: Log password to console if email fails
    console.log('='.repeat(70));
    console.log('📧 FALLBACK: PASSWORD LOGGED TO CONSOLE');
    console.log('='.repeat(70));
    console.log(`👤 User: ${firstName}`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${tempPassword}`);
    console.log('='.repeat(70) + '\n');
    console.warn('⚠️  Manually share this password with the user.\n');
    
    return { success: false, error: err.message, code: err.code };
  }
};

/**
 * POST /auth/login
 * Login user and return JWT
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user
    const result = await pool.query(
      `SELECT id, email, password_hash, role_id
       FROM users
       WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    // 2. Check password
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const roleId = Number(user.role_id);

    // 3. Create token
    const token = jwt.sign(
      { id: user.id, role: roleId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 4. Send token
    res.json({
      token,
      role: roleId === 1 ? "admin" : "employee",
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /auth/me
 * Return logged-in user from token
 */
export const me = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT id, email, role_id
       FROM users
       WHERE id = $1`,
      [userId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Auth me error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//Add User
export const addUser = async (req, res) => {
  try {
    const { first_name, last_name, email, department_id, role_id, mobile_number } = req.body;

    // 1. Validate required fields
    if (!first_name || !email || !department_id || !role_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 2. Check if user already exists
    const existingUser = await pool.query(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    // 3. Generate a secure random temporary password
    const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    
    // 4. Hash the password for secure storage
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(tempPassword, saltRounds);

    // 5. Insert new user into database
    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, email, department_id, role_id, password_hash, mobile_number, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true) 
       RETURNING id, first_name, last_name, email, role_id, department_id, mobile_number`,
      [first_name, last_name, email, department_id, role_id, password_hash, mobile_number]
    );

    const newUser = result.rows[0];

    console.log(`\n👤 Creating user: ${first_name} ${last_name} (${email})`);
    console.log(`🔑 Generated temporary password (length: ${tempPassword.length})`);

    // 6. Send welcome email with temporary password
    const emailResult = await sendWelcomeEmail(email, first_name, tempPassword);

    // 7. Return success response with user data (NOT the password)
    let message = "User added successfully.";
    if (emailResult.success) {
      message += " Welcome email sent to " + email;
      console.log(`✅ User creation completed successfully with email sent.\n`);
    } else {
      message += " Email could not be sent. Password logged to server console.";
      console.log(`⚠️  User creation completed but email failed. Check logs above.\n`);
    }

    res.status(201).json({ 
      message: message, 
      user: newUser,
      emailSent: emailResult.success
    });
  } catch (err) {
    console.error("Add user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Function to "Delete" (Deactivate) a user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      `UPDATE users SET is_active = false WHERE id = $1`, 
      [id]
    );
    res.json({ message: "User deactivated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update user role (for admin access toggle)
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role_id } = req.body;

    // Validate role_id
    if (role_id !== 1 && role_id !== 2 && role_id !== '1' && role_id !== '2') {
      return res.status(400).json({ message: "Invalid role_id. Must be 1 (admin) or 2 (user)" });
    }

    // Update the user's role
    const result = await pool.query(
      `UPDATE users SET role_id = $1 WHERE id = $2 RETURNING id, first_name, last_name, role_id`,
      [role_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ 
      message: "User role updated successfully",
      user: result.rows[0]
    });
  } catch (err) {
    console.error("Error updating user role:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users with department names (for Team List)
export const getAllUsers = async (req, res) => {
  try {
    // This query joins with departments and roles to get readable names
    const result = await pool.query(
      `SELECT u.id, u.first_name, u.last_name, u.email, u.role_id, u.mobile_number, u.is_active, d.name as department_name 
       FROM users u
       LEFT JOIN departments d ON u.department_id = d.id`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /auth/forgot-password
 * Generate reset token and send email with reset link
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // 1. Check if user exists
    const userResult = await pool.query(
      `SELECT id, first_name, email FROM users WHERE email = $1`,
      [email]
    );

    if (userResult.rows.length === 0) {
      // Don't reveal if email exists (security best practice)
      return res.json({ 
        message: "If an account with that email exists, a password reset link has been sent." 
      });
    }

    const user = userResult.rows[0];

    // 2. Generate secure random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // 3. Store token in database
    await pool.query(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, resetToken, expiresAt]
    );

    // 4. Send reset email
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
    const emailResult = await sendPasswordResetEmail(user.email, user.first_name, resetLink);

    console.log(`🔑 Password reset requested for: ${user.email}`);
    if (emailResult.success) {
      console.log(`✅ Reset email sent successfully\n`);
    } else {
      console.log(`⚠️  Email failed. Reset link: ${resetLink}\n`);
    }

    res.json({ 
      message: "If an account with that email exists, a password reset link has been sent.",
      emailSent: emailResult.success
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /auth/reset-password
 * Verify token and update password
 */
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    // 1. Find valid token
    const tokenResult = await pool.query(
      `SELECT user_id, expires_at, used 
       FROM password_reset_tokens 
       WHERE token = $1`,
      [token]
    );

    if (tokenResult.rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    const resetToken = tokenResult.rows[0];

    // 2. Check if token is already used
    if (resetToken.used) {
      return res.status(400).json({ message: "This reset link has already been used" });
    }

    // 3. Check if token is expired
    if (new Date() > new Date(resetToken.expires_at)) {
      return res.status(400).json({ message: "Reset token has expired. Please request a new one." });
    }

    // 4. Hash new password
    const password_hash = await bcrypt.hash(newPassword, 10);

    // 5. Update user password
    await pool.query(
      `UPDATE users SET password_hash = $1 WHERE id = $2`,
      [password_hash, resetToken.user_id]
    );

    // 6. Mark token as used
    await pool.query(
      `UPDATE password_reset_tokens SET used = true WHERE token = $1`,
      [token]
    );

    console.log(`✅ Password reset successful for user ID: ${resetToken.user_id}\n`);

    res.json({ message: "Password reset successful. You can now login with your new password." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Helper function to send password reset email
const sendPasswordResetEmail = async (email, firstName, resetLink) => {
  if (!transporter || !isEmailConfigured()) {
    console.log('\n' + '='.repeat(70));
    console.log('📧 EMAIL NOT CONFIGURED - RESET LINK LOGGED TO CONSOLE');
    console.log('='.repeat(70));
    console.log(`👤 User: ${firstName}`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔗 Reset Link: ${resetLink}`);
    console.log('='.repeat(70) + '\n');
    console.warn('⚠️  Configure EMAIL_USER and EMAIL_PASS in .env to send actual emails.\n');
    return { success: false, reason: 'Email not configured' };
  }

  try {
    console.log(`\n📧 Sending password reset email to: ${email}`);
    
    const emailText = `Password Reset Request

Dear ${firstName},

You have requested to reset your password for your KKH Portal account.

Click the link below to reset your password (valid for 1 hour):
${resetLink}

If you did not request this password reset, please ignore this email and your password will remain unchanged.

For security reasons, this link will expire in 1 hour.

---
KKH Administration Team
Do not reply to this email.`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request - KKH Portal",
      text: emailText,
      html: null,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Password reset email sent successfully!`);
    console.log(`   Message ID: ${info.messageId}\n`);
    
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`\n❌ FAILED TO SEND PASSWORD RESET EMAIL`);
    console.error(`   Recipient: ${email}`);
    console.error(`   Error: ${err.message}\n`);
    
    // Fallback: Log reset link to console
    console.log('='.repeat(70));
    console.log('📧 FALLBACK: RESET LINK LOGGED TO CONSOLE');
    console.log('='.repeat(70));
    console.log(`👤 User: ${firstName}`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔗 Reset Link: ${resetLink}`);
    console.log('='.repeat(70) + '\n');
    console.warn('⚠️  Manually share this link with the user.\n');
    
    return { success: false, error: err.message };
  }
};
