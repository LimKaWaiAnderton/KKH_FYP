// Email Configuration Test Utility
// Run this to test if your Gmail credentials work
// Usage: node test-email.js

import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

console.log('\n📧 Email Configuration Test\n' + '='.repeat(50));

// Display configuration
console.log('Email User:', process.env.EMAIL_USER || 'NOT SET');
console.log('Email Pass Length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'NOT SET');
console.log('Email Service:', process.env.EMAIL_SERVICE || 'gmail');

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

console.log('\n🔍 Testing SMTP connection...');

// Test connection
transporter.verify((error, success) => {
  if (error) {
    console.log('\n❌ SMTP Connection FAILED\n' + '='.repeat(50));
    console.log('Error:', error.message);
    console.log('Code:', error.code);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔧 Authentication Failed - Solutions:');
      console.log('1. Go to: https://myaccount.google.com/security');
      console.log('2. Verify "2-Step Verification" is ON');
      console.log('3. Go to: https://myaccount.google.com/apppasswords');
      console.log('4. Generate a NEW App Password');
      console.log('5. Select "Mail" and your device');
      console.log('6. Copy the 16-character password (no spaces!)');
      console.log('7. Update EMAIL_PASS in .env file');
      console.log('8. Restart this test');
      console.log('\n⚠️  Common Issues:');
      console.log('   - App Password expired or revoked');
      console.log('   - Spaces in the password');
      console.log('   - 2FA not enabled on Google account');
      console.log('   - Wrong Gmail address');
    }
    
    process.exit(1);
  } else {
    console.log('\n✅ SMTP Connection SUCCESSFUL!\n' + '='.repeat(50));
    console.log('Your email configuration is working correctly.');
    console.log('\n📧 Sending test email...');
    
    // Send test email
    const mailOptions = {
      from: `"KKH Portal Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to self for testing
      subject: "Test Email - KKH Portal",
      html: `
        <h2>Email Configuration Test</h2>
        <p>This is a test email from KKH Portal backend.</p>
        <p>If you received this, your email configuration is working correctly!</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      `,
    };
    
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log('\n❌ Test email FAILED');
        console.log('Error:', err.message);
        process.exit(1);
      } else {
        console.log('\n✅ Test email SENT successfully!');
        console.log('Message ID:', info.messageId);
        console.log('\n✅ Check your inbox:', process.env.EMAIL_USER);
        console.log('\n' + '='.repeat(50));
        console.log('Email configuration is ready for production!');
        process.exit(0);
      }
    });
  }
});
