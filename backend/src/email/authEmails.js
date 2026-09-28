const buildVerificationEmailText = (email, code, name) => {
  return `Welcome to TB Tours!

Hi ${name || email},

Thank you for registering with TB Tours. To verify your email address and complete your registration, please use the verification code below:

${code}

This code will expire in 15 minutes.

If you didn't register with TB Tours, please ignore this email.

Best regards,
TB Tours (Pty)Ltd
https://tb-tours.co.za`;
};

const buildVerificationEmailHtml = (email, code, name) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; margin: 0; padding: 0; }
    .container { max-width: 550px; margin: 0 auto; padding: 0; }
    .header { background: linear-gradient(135deg, #0a1530 0%, #1a2d5a 100%); color: white; padding: 30px 20px; text-align: center; border-bottom: 4px solid #f2b112; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px; }
    .header p { margin: 8px 0 0 0; font-size: 14px; opacity: 0.9; }
    .content { background-color: #f9f9f9; padding: 30px 20px; }
    .content p { margin: 15px 0; line-height: 1.6; color: #555; font-size: 15px; }
    .code-box { 
      background: linear-gradient(135deg, #f2b112 0%, #ffc94d 100%);
      padding: 20px; 
      text-align: center; 
      font-size: 32px; 
      font-weight: bold; 
      letter-spacing: 6px; 
      margin: 25px 0; 
      border-radius: 8px;
      color: #0a1530;
      box-shadow: 0 4px 12px rgba(242, 177, 18, 0.3);
    }
    .expiry { background-color: #fff3cd; padding: 12px; border-left: 4px solid #f2b112; margin: 20px 0; border-radius: 4px; font-size: 14px; color: #856404; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 13px; color: #7f8c8d; }
    .footer-brand { color: #0a1530; font-weight: 600; margin-bottom: 5px; }
    .footer a { color: #f2b112; text-decoration: none; }
    .footer a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to TB Tours!</h1>
      <p>Verify your email to get started</p>
    </div>
    <div class="content">
      <p>Hi ${name || email},</p>
      <p>Thank you for registering with TB Tours. To verify your email address and complete your registration, please use the verification code below:</p>
      <div class="code-box">${code}</div>
      <div class="expiry">
        ⏱️ This code will expire in <strong>15 minutes</strong>
      </div>
      <p>If you didn't register with TB Tours, please ignore this email and your account will not be created.</p>
      <div class="footer">
        <p class="footer-brand">TB Tours (Pty)Ltd</p>
        <p><a href="https://tb-tours.co.za">Visit our website</a></p>
        <p>Cape Town, South Africa</p>
        <p>Private tours | Airport transfers | Chauffeur services</p>
      </div>
    </div>
  </div>
</body>
</html>`;
};

const buildPasswordResetEmailText = (email, code, name) => {
  return `Password Reset Request

Hi ${name || email},

We received a request to reset your password. To proceed with resetting your password, please use the verification code below:

${code}

This code will expire in 15 minutes.

If you didn't request a password reset, please ignore this email.

Best regards,
TB Tours (Pty)Ltd
https://tb-tours.co.za`;
};

const buildPasswordResetEmailHtml = (email, code, name) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; margin: 0; padding: 0; }
    .container { max-width: 550px; margin: 0 auto; padding: 0; }
    .header { background: linear-gradient(135deg, #0a1530 0%, #1a2d5a 100%); color: white; padding: 30px 20px; text-align: center; border-bottom: 4px solid #f2b112; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px; }
    .header p { margin: 8px 0 0 0; font-size: 14px; opacity: 0.9; }
    .content { background-color: #f9f9f9; padding: 30px 20px; }
    .content p { margin: 15px 0; line-height: 1.6; color: #555; font-size: 15px; }
    .code-box { 
      background: linear-gradient(135deg, #f2b112 0%, #ffc94d 100%);
      padding: 20px; 
      text-align: center; 
      font-size: 32px; 
      font-weight: bold; 
      letter-spacing: 6px; 
      margin: 25px 0; 
      border-radius: 8px;
      color: #0a1530;
      box-shadow: 0 4px 12px rgba(242, 177, 18, 0.3);
    }
    .warning { background-color: #fff3cd; padding: 12px; border-left: 4px solid #f2b112; margin: 20px 0; border-radius: 4px; font-size: 14px; color: #856404; }
    .expiry { background-color: #e8f4f8; padding: 12px; border-left: 4px solid #0a1530; margin: 20px 0; border-radius: 4px; font-size: 14px; color: #0a1530; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 13px; color: #7f8c8d; }
    .footer-brand { color: #0a1530; font-weight: 600; margin-bottom: 5px; }
    .footer a { color: #f2b112; text-decoration: none; }
    .footer a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset Request</h1>
      <p>Secure your account</p>
    </div>
    <div class="content">
      <p>Hi ${name || email},</p>
      <p>We received a request to reset your password. To proceed with resetting your password, please use the verification code below:</p>
      <div class="code-box">${code}</div>
      <div class="expiry">
        ⏱️ This code will expire in <strong>15 minutes</strong>
      </div>
      <div class="warning">
        ⚠️ If you didn't request this password reset, please ignore this email. Your account is secure.
      </div>
      <p>Once you've used this code, you'll be able to create a new password for your TB Tours account.</p>
      <div class="footer">
        <p class="footer-brand">TB Tours (Pty)Ltd</p>
        <p><a href="https://tb-tours.co.za">Visit our website</a></p>
        <p>Cape Town, South Africa</p>
        <p>Private tours | Airport transfers | Chauffeur services</p>
      </div>
    </div>
  </div>
</body>
</html>`;
};

module.exports = {
  buildVerificationEmailText,
  buildVerificationEmailHtml,
  buildPasswordResetEmailText,
  buildPasswordResetEmailHtml,
};
