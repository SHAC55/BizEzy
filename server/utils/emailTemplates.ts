export const getPasswordResetTemplate = (url: string) => ({
  subject: "Reset Your Password",
  text: `You requested a password reset. Click on the link to reset your password: ${url}`,
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .email-wrapper {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
      min-height: 100vh;
    }

    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 30px;
      text-align: center;
    }

    .logo-circle {
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .logo-icon {
      font-size: 40px;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }

    .header h1 {
      color: #ffffff;
      font-size: 28px;
      font-weight: 700;
      margin: 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .content {
      padding: 50px 40px;
    }

    .icon-badge {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .content h2 {
      color: #1a202c;
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 16px;
      line-height: 1.3;
    }

    .content p {
      color: #4a5568;
      font-size: 16px;
      line-height: 1.8;
      margin-bottom: 32px;
    }

    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff !important;
      text-decoration: none !important;
      font-weight: 600;
      font-size: 16px;
      padding: 16px 40px;
      border-radius: 12px;
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
      transition: all 0.3s ease;
      text-align: center;
    }

    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(102, 126, 234, 0.5);
    }

    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
      margin: 40px 0;
    }

    .security-notice {
      background: #f7fafc;
      border-left: 4px solid #667eea;
      padding: 20px;
      border-radius: 8px;
      margin-top: 32px;
    }

    .security-notice p {
      color: #2d3748;
      font-size: 14px;
      margin: 0;
      line-height: 1.6;
    }

    .security-notice strong {
      color: #1a202c;
      display: block;
      margin-bottom: 8px;
    }

    .footer {
      background: #f7fafc;
      padding: 30px 40px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }

    .footer p {
      color: #718096;
      font-size: 14px;
      margin: 8px 0;
    }

    .footer a {
      color: #667eea;
      text-decoration: none;
    }

    @media only screen and (max-width: 600px) {
      .email-wrapper {
        padding: 20px 10px;
      }

      .content {
        padding: 40px 24px;
      }

      .header {
        padding: 30px 20px;
      }

      .header h1 {
        font-size: 24px;
      }

      .content h2 {
        font-size: 20px;
      }

      .cta-button {
        padding: 14px 32px;
        font-size: 15px;
      }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <div class="header">
        <div class="logo-circle">
          <span class="logo-icon">??</span>
        </div>
        <h1>Password Reset Request</h1>
      </div>

      <div class="content">
        <div style="text-align: center;">
          <div class="icon-badge">
            <span style="font-size: 28px;">??</span>
          </div>
        </div>

        <h2>Reset Your Password</h2>

        <p>
          We received a request to reset your password. Click the button below to create a new password. This link will expire in 1 hour for security reasons.
        </p>

        <div style="text-align: center;">
          <a href="${url}" class="cta-button">Reset Password</a>
        </div>

        <div class="divider"></div>

        <div class="security-notice">
          <strong>??? Security Notice</strong>
          <p>
            If you didn't request a password reset, please ignore this email. Your password will remain unchanged. For security purposes, this link will expire in 1 hour.
          </p>
        </div>
      </div>

      <div class="footer">
        <p style="margin-bottom: 16px; color: #2d3748; font-weight: 500;">Need help?</p>
        <p>
          If you're having trouble clicking the button, copy and paste the URL below into your web browser:
        </p>
        <p style="word-break: break-all; color: #667eea; font-size: 12px; margin-top: 12px;">
          ${url}
        </p>
        <div class="divider" style="margin: 24px 0;"></div>
        <p style="font-size: 13px;">
          c ${new Date().getFullYear()} Your Company. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>`,
});

export const getVerifyEmailTemplate = (url: string) => ({
  subject: "Verify Your Email Address",
  text: `Click on the link to verify your email address: ${url}`,
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .email-wrapper {
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      padding: 40px 20px;
      min-height: 100vh;
    }

    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .header {
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      padding: 40px 30px;
      text-align: center;
    }

    .logo-circle {
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .logo-icon {
      font-size: 40px;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }

    .header h1 {
      color: #ffffff;
      font-size: 28px;
      font-weight: 700;
      margin: 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .content {
      padding: 50px 40px;
    }

    .icon-badge {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
      box-shadow: 0 4px 12px rgba(17, 153, 142, 0.3);
    }

    .content h2 {
      color: #1a202c;
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 16px;
      line-height: 1.3;
    }

    .content p {
      color: #4a5568;
      font-size: 16px;
      line-height: 1.8;
      margin-bottom: 32px;
    }

    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      color: #ffffff !important;
      text-decoration: none !important;
      font-weight: 600;
      font-size: 16px;
      padding: 16px 40px;
      border-radius: 12px;
      box-shadow: 0 8px 20px rgba(17, 153, 142, 0.4);
      transition: all 0.3s ease;
      text-align: center;
    }

    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(17, 153, 142, 0.5);
    }

    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
      margin: 40px 0;
    }

    .welcome-box {
      background: linear-gradient(135deg, rgba(17, 153, 142, 0.1) 0%, rgba(56, 239, 125, 0.1) 100%);
      border: 2px solid rgba(17, 153, 142, 0.2);
      padding: 24px;
      border-radius: 12px;
      margin-top: 32px;
    }

    .welcome-box h3 {
      color: #1a202c;
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 12px;
    }

    .welcome-box ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .welcome-box li {
      color: #2d3748;
      font-size: 14px;
      padding: 8px 0;
      padding-left: 28px;
      position: relative;
    }

    .welcome-box li:before {
      content: "�";
      position: absolute;
      left: 0;
      color: #11998e;
      font-weight: bold;
      font-size: 16px;
    }

    .footer {
      background: #f7fafc;
      padding: 30px 40px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }

    .footer p {
      color: #718096;
      font-size: 14px;
      margin: 8px 0;
    }

    .footer a {
      color: #11998e;
      text-decoration: none;
    }

    @media only screen and (max-width: 600px) {
      .email-wrapper {
        padding: 20px 10px;
      }

      .content {
        padding: 40px 24px;
      }

      .header {
        padding: 30px 20px;
      }

      .header h1 {
        font-size: 24px;
      }

      .content h2 {
        font-size: 20px;
      }

      .cta-button {
        padding: 14px 32px;
        font-size: 15px;
      }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <div class="header">
        <div class="logo-circle">
          <span class="logo-icon">?</span>
        </div>
        <h1>Welcome Aboard!</h1>
      </div>

      <div class="content">
        <div style="text-align: center;">
          <div class="icon-badge">
            <span style="font-size: 28px;">??</span>
          </div>
        </div>

        <h2>Verify Your Email Address</h2>

        <p>
          Thanks for signing up! We're excited to have you on board. To get started and unlock all features, please verify your email address by clicking the button below.
        </p>

        <div style="text-align: center;">
          <a href="${url}" class="cta-button">Verify Email Address</a>
        </div>

        <div class="divider"></div>

        <div class="welcome-box">
          <h3>?? What's Next?</h3>
          <ul>
            <li>Complete your profile setup</li>
            <li>Explore all the amazing features</li>
            <li>Connect with your team</li>
            <li>Start creating something awesome</li>
          </ul>
        </div>

        <p style="margin-top: 32px; font-size: 14px; color: #718096;">
          This verification link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
        </p>
      </div>

      <div class="footer">
        <p style="margin-bottom: 16px; color: #2d3748; font-weight: 500;">Need help?</p>
        <p>
          If you're having trouble clicking the button, copy and paste the URL below into your web browser:
        </p>
        <p style="word-break: break-all; color: #11998e; font-size: 12px; margin-top: 12px;">
          ${url}
        </p>
        <div class="divider" style="margin: 24px 0;"></div>
        <p style="font-size: 13px;">
          c ${new Date().getFullYear()} Your Company. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>`,
});

type LowStockItem = {
  name: string;
  quantity: number;
  minimumQuantity: number;
  sku?: string | null;
};

export const getLowStockAlertTemplate = ({
  businessName,
  ownerName,
  items,
}: {
  businessName: string;
  ownerName?: string | null;
  items: LowStockItem[];
}) => {
  const greeting = ownerName ? `Hi ${ownerName},` : "Hi there,";
  const itemCount = items.length;
  const headline =
    itemCount === 1
      ? "1 product is running low on stock"
      : `${itemCount} products are running low on stock`;

  const rowsHtml = items
    .map((item) => {
      const isOut = item.quantity <= 0;
      const status = isOut ? "OUT OF STOCK" : "LOW";
      const statusColor = isOut ? "#B91C1C" : "#B45309";
      const statusBg = isOut ? "#FEE2E2" : "#FEF3C7";
      const skuLine = item.sku
        ? `<div style="font-size:12px;color:#94a3b8;margin-top:4px;">SKU: ${item.sku}</div>`
        : "";
      return `
        <tr>
          <td style="padding:14px 16px;border-bottom:1px solid #e2e8f0;">
            <div style="font-size:15px;font-weight:600;color:#0f172a;">${item.name}</div>
            ${skuLine}
          </td>
          <td style="padding:14px 16px;border-bottom:1px solid #e2e8f0;text-align:center;font-size:14px;color:#1e293b;font-weight:600;">
            ${item.quantity}
          </td>
          <td style="padding:14px 16px;border-bottom:1px solid #e2e8f0;text-align:center;font-size:14px;color:#64748b;">
            ${item.minimumQuantity}
          </td>
          <td style="padding:14px 16px;border-bottom:1px solid #e2e8f0;text-align:right;">
            <span style="display:inline-block;padding:4px 10px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:0.6px;background:${statusBg};color:${statusColor};">
              ${status}
            </span>
          </td>
        </tr>`;
    })
    .join("");

  const textLines = items
    .map(
      (item) =>
        `- ${item.name}${item.sku ? ` (SKU: ${item.sku})` : ""}: ${item.quantity} left (minimum ${item.minimumQuantity})`,
    )
    .join("\n");

  return {
    subject: `Low Stock Alert — ${businessName}`,
    text: `${greeting}

${headline} at ${businessName}. Please restock soon to avoid running out.

${textLines}

— Bizezy`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Low Stock Alert</title>
</head>
<body style="margin:0;padding:0;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f1f5f9;-webkit-font-smoothing:antialiased;">
  <div style="background:linear-gradient(135deg,#f97316 0%,#dc2626 100%);padding:40px 20px;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.25);">

      <div style="background:linear-gradient(135deg,#f97316 0%,#dc2626 100%);padding:36px 30px;text-align:center;">
        <div style="display:inline-block;width:64px;height:64px;line-height:64px;background:rgba(255,255,255,0.18);border:2px solid rgba(255,255,255,0.32);border-radius:50%;margin-bottom:16px;font-size:28px;font-weight:800;color:#ffffff;">
          !
        </div>
        <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.3px;">
          Low Stock Alert
        </h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.92);font-size:14px;">
          ${businessName}
        </p>
      </div>

      <div style="padding:40px 36px 24px;">
        <p style="margin:0 0 8px;font-size:15px;color:#1e293b;font-weight:600;">${greeting}</p>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#475569;">
          ${headline} at <strong style="color:#0f172a;">${businessName}</strong>.
          Below is the list of products that have reached or fallen below your minimum stock threshold.
          Please restock them soon to keep your sales running smoothly.
        </p>

        <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
          <thead>
            <tr style="background:#f8fafc;">
              <th align="left" style="padding:12px 16px;font-size:11px;font-weight:700;letter-spacing:0.8px;color:#64748b;text-transform:uppercase;border-bottom:1px solid #e2e8f0;">Product</th>
              <th align="center" style="padding:12px 16px;font-size:11px;font-weight:700;letter-spacing:0.8px;color:#64748b;text-transform:uppercase;border-bottom:1px solid #e2e8f0;">In Stock</th>
              <th align="center" style="padding:12px 16px;font-size:11px;font-weight:700;letter-spacing:0.8px;color:#64748b;text-transform:uppercase;border-bottom:1px solid #e2e8f0;">Minimum</th>
              <th align="right" style="padding:12px 16px;font-size:11px;font-weight:700;letter-spacing:0.8px;color:#64748b;text-transform:uppercase;border-bottom:1px solid #e2e8f0;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div style="margin-top:28px;padding:18px 20px;background:#fff7ed;border-left:4px solid #f97316;border-radius:8px;">
          <p style="margin:0;font-size:13px;color:#7c2d12;line-height:1.6;">
            <strong style="display:block;margin-bottom:4px;color:#7c2d12;">Tip</strong>
            Open Bizezy and head to Inventory to update stock levels or place a restock order with your supplier.
          </p>
        </div>
      </div>

      <div style="background:#f8fafc;padding:24px 36px;text-align:center;border-top:1px solid #e2e8f0;">
        <p style="margin:0;font-size:13px;color:#64748b;line-height:1.6;">
          You're receiving this because you're the registered owner of <strong style="color:#1e293b;">${businessName}</strong> on Bizezy.
        </p>
        <p style="margin:12px 0 0;font-size:12px;color:#94a3b8;">
          © ${new Date().getFullYear()} Bizezy. All rights reserved.
        </p>
      </div>

    </div>
  </div>
</body>
</html>`,
  };
};
