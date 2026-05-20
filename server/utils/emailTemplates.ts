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

const BIZEZY_LOGO_URL = "https://www.bizezy.in/Bizezylogo.png";
const BIZEZY_SITE_URL = "https://www.bizezy.in";
const BIZEZY_INVENTORY_URL = "https://www.bizezy.in/inventory";
const BIZEZY_TWITTER_URL = "https://x.com/Bizezyapp";
const BIZEZY_INSTAGRAM_URL = "https://www.instagram.com/bizezyapp/";
const BIZEZY_LINKEDIN_URL = "https://www.linkedin.com/company/bizezy/";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const getLowStockAlertTemplate = ({
  businessName,
  ownerName,
  items,
}: {
  businessName: string;
  ownerName?: string | null;
  items: LowStockItem[];
}) => {
  const safeBusinessName = escapeHtml(businessName);
  const safeOwnerName = ownerName ? escapeHtml(ownerName) : null;
  const greeting = safeOwnerName ? `Hi ${safeOwnerName},` : "Hi there,";
  const itemCount = items.length;
  const outCount = items.filter((item) => item.quantity <= 0).length;
  const lowCount = itemCount - outCount;

  const headline =
    itemCount === 1
      ? "1 product needs your attention"
      : `${itemCount} products need your attention`;
  const preheader =
    outCount > 0
      ? `${outCount} out of stock${lowCount > 0 ? `, ${lowCount} low` : ""} at ${businessName}. Tap to restock.`
      : `${itemCount} ${itemCount === 1 ? "product is" : "products are"} below your minimum threshold at ${businessName}.`;

  const rowsHtml = items
    .map((item, index) => {
      const isOut = item.quantity <= 0;
      const status = isOut ? "OUT OF STOCK" : "LOW";
      const statusColor = isOut ? "#7F1D1D" : "#92400E";
      const statusBg = isOut ? "#FEE2E2" : "#FEF3C7";
      const statusBorder = isOut ? "#FCA5A5" : "#FCD34D";
      const safeName = escapeHtml(item.name);
      const skuLine = item.sku
        ? `<div style="font-size:12px;color:#71717a;margin-top:4px;font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace;letter-spacing:0.2px;">SKU · ${escapeHtml(item.sku)}</div>`
        : "";
      const borderStyle =
        index === items.length - 1
          ? ""
          : "border-bottom:1px solid #e4e4e7;";
      return `
        <tr>
          <td style="padding:16px 18px;${borderStyle}vertical-align:top;">
            <div style="font-size:15px;font-weight:700;color:#09090b;letter-spacing:-0.2px;">${safeName}</div>
            ${skuLine}
          </td>
          <td align="center" style="padding:16px 14px;${borderStyle}vertical-align:top;">
            <div style="font-size:17px;font-weight:800;color:#09090b;letter-spacing:-0.3px;font-variant-numeric:tabular-nums;">${item.quantity}</div>
            <div style="font-size:10px;font-weight:600;letter-spacing:0.8px;color:#a1a1aa;text-transform:uppercase;margin-top:2px;">In Stock</div>
          </td>
          <td align="center" style="padding:16px 14px;${borderStyle}vertical-align:top;">
            <div style="font-size:15px;font-weight:600;color:#52525b;font-variant-numeric:tabular-nums;">${item.minimumQuantity}</div>
            <div style="font-size:10px;font-weight:600;letter-spacing:0.8px;color:#a1a1aa;text-transform:uppercase;margin-top:2px;">Min</div>
          </td>
          <td align="right" style="padding:16px 18px;${borderStyle}vertical-align:top;">
            <span style="display:inline-block;padding:5px 10px;border-radius:6px;font-size:10px;font-weight:800;letter-spacing:0.8px;background:${statusBg};color:${statusColor};border:1px solid ${statusBorder};font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">${status}</span>
          </td>
        </tr>`;
    })
    .join("");

  const textLines = items
    .map(
      (item) =>
        `- ${item.name}${item.sku ? ` (SKU: ${item.sku})` : ""}: ${item.quantity} left (minimum ${item.minimumQuantity})${item.quantity <= 0 ? " — OUT OF STOCK" : ""}`,
    )
    .join("\n");

  const subjectPrefix = outCount > 0 ? "⚠ Out of stock" : "Low stock";

  return {
    subject: `${subjectPrefix} · ${businessName} (${itemCount} ${itemCount === 1 ? "item" : "items"})`,
    text: `${greeting}

${headline} at ${businessName}.

${textLines}

Open BizEzy to restock: ${BIZEZY_INVENTORY_URL}

—
BizEzy · Business Management, made easy
${BIZEZY_SITE_URL}
`,
    html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light only">
  <title>Low Stock Alert · BizEzy</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <!--[if mso]>
  <style type="text/css">
    body, table, td, p, a, h1, h2, h3 { font-family: Arial, Helvetica, sans-serif !important; }
  </style>
  <![endif]-->
  <style>
    @media only screen and (max-width: 620px) {
      .container { width: 100% !important; }
      .px-outer { padding-left: 16px !important; padding-right: 16px !important; }
      .px-inner { padding-left: 24px !important; padding-right: 24px !important; }
      .hero-pad { padding: 32px 24px !important; }
      .headline { font-size: 28px !important; line-height: 1.15 !important; }
      .stat-num { font-size: 32px !important; }
      .cta-btn { display: block !important; width: 100% !important; box-sizing: border-box !important; }
      .hide-sm { display: none !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#fafafa;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility;color:#09090b;">
  <div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#fafafa;opacity:0;">${escapeHtml(preheader)}</div>
  <div style="display:none;max-height:0;overflow:hidden;">&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#fafafa;">
    <tr>
      <td align="center" class="px-outer" style="padding:32px 20px;">

        <!-- Brand bar -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="container" style="width:600px;max-width:600px;margin:0 auto 16px;">
          <tr>
            <td align="left" style="padding:0 4px 16px;">
              <a href="${BIZEZY_SITE_URL}" style="display:inline-block;text-decoration:none;color:inherit;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="vertical-align:middle;padding-right:10px;">
                      <img src="${BIZEZY_LOGO_URL}" width="32" height="32" alt="BizEzy" style="display:block;border:0;outline:none;border-radius:8px;width:32px;height:32px;">
                    </td>
                    <td style="vertical-align:middle;">
                      <span style="font-family:Georgia,'Times New Roman',serif;font-size:20px;font-weight:700;letter-spacing:-0.6px;color:#09090b;">Biz</span><span style="font-family:Georgia,'Times New Roman',serif;font-size:20px;font-weight:700;letter-spacing:-0.6px;color:#a1a1aa;">Ezy</span>
                    </td>
                  </tr>
                </table>
              </a>
            </td>
          </tr>
        </table>

        <!-- Main card -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="container" style="width:600px;max-width:600px;background:#ffffff;border:1px solid #e4e4e7;border-radius:20px;overflow:hidden;box-shadow:0 1px 2px rgba(9,9,11,0.04),0 12px 32px rgba(9,9,11,0.06);">

          <!-- Hero -->
          <tr>
            <td class="hero-pad" style="padding:44px 40px 36px;background:#09090b;background-image:linear-gradient(135deg,#18181b 0%,#09090b 100%);">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td>
                    <span style="display:inline-block;padding:5px 11px;border-radius:999px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.14);font-size:10px;font-weight:700;letter-spacing:1.2px;color:#fafafa;text-transform:uppercase;">
                      ${outCount > 0 ? "● Urgent · Out of Stock" : "● Inventory Alert"}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:18px;">
                    <h1 class="headline" style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:1.1;letter-spacing:-1.2px;font-weight:700;color:#ffffff;">
                      ${headline}.
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:14px;">
                    <p style="margin:0;font-size:15px;line-height:1.6;color:#a1a1aa;max-width:460px;">
                      A quick heads-up from your inventory at <span style="color:#fafafa;font-weight:600;">${safeBusinessName}</span>. Restock soon to keep sales moving.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Stat strip -->
          <tr>
            <td style="background:#09090b;padding:0 40px 40px;" class="hero-pad">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#ffffff;border-radius:14px;">
                <tr>
                  <td align="center" style="padding:18px 14px;border-right:1px solid #e4e4e7;">
                    <div class="stat-num" style="font-size:26px;font-weight:800;color:#09090b;letter-spacing:-0.6px;font-variant-numeric:tabular-nums;">${itemCount}</div>
                    <div style="font-size:11px;font-weight:600;letter-spacing:0.6px;color:#71717a;text-transform:uppercase;margin-top:4px;">Total flagged</div>
                  </td>
                  <td align="center" style="padding:18px 14px;border-right:1px solid #e4e4e7;">
                    <div class="stat-num" style="font-size:26px;font-weight:800;color:#92400E;letter-spacing:-0.6px;font-variant-numeric:tabular-nums;">${lowCount}</div>
                    <div style="font-size:11px;font-weight:600;letter-spacing:0.6px;color:#71717a;text-transform:uppercase;margin-top:4px;">Low stock</div>
                  </td>
                  <td align="center" style="padding:18px 14px;">
                    <div class="stat-num" style="font-size:26px;font-weight:800;color:#7F1D1D;letter-spacing:-0.6px;font-variant-numeric:tabular-nums;">${outCount}</div>
                    <div style="font-size:11px;font-weight:600;letter-spacing:0.6px;color:#71717a;text-transform:uppercase;margin-top:4px;">Out of stock</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="px-inner" style="padding:36px 40px 12px;">
              <p style="margin:0 0 6px;font-size:15px;font-weight:600;color:#09090b;">${greeting}</p>
              <p style="margin:0 0 28px;font-size:15px;line-height:1.65;color:#52525b;">
                Here's the list of products that have reached or fallen below the minimum threshold you set. We'd recommend reaching out to your supplier soon to avoid stockouts.
              </p>

              <!-- Items table -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #e4e4e7;border-radius:14px;border-collapse:separate;overflow:hidden;">
                <thead>
                  <tr style="background:#fafafa;">
                    <th align="left" style="padding:12px 18px;font-size:10px;font-weight:800;letter-spacing:1px;color:#71717a;text-transform:uppercase;border-bottom:1px solid #e4e4e7;">Product</th>
                    <th align="center" style="padding:12px 14px;font-size:10px;font-weight:800;letter-spacing:1px;color:#71717a;text-transform:uppercase;border-bottom:1px solid #e4e4e7;">Stock</th>
                    <th align="center" style="padding:12px 14px;font-size:10px;font-weight:800;letter-spacing:1px;color:#71717a;text-transform:uppercase;border-bottom:1px solid #e4e4e7;">Min</th>
                    <th align="right" style="padding:12px 18px;font-size:10px;font-weight:800;letter-spacing:1px;color:#71717a;text-transform:uppercase;border-bottom:1px solid #e4e4e7;">Status</th>
                  </tr>
                </thead>
                <tbody>${rowsHtml}
                </tbody>
              </table>

              <!-- CTA -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:32px;">
                <tr>
                  <td align="center">
                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${BIZEZY_INVENTORY_URL}" style="height:50px;v-text-anchor:middle;width:240px;" arcsize="14%" stroke="f" fillcolor="#09090b">
                      <w:anchorlock/>
                      <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;">Open Inventory →</center>
                    </v:roundrect>
                    <![endif]-->
                    <!--[if !mso]><!-- -->
                    <a href="${BIZEZY_INVENTORY_URL}" class="cta-btn" style="display:inline-block;background:#09090b;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;letter-spacing:-0.2px;padding:15px 32px;border-radius:12px;box-shadow:0 4px 14px rgba(9,9,11,0.18);border:2px solid #09090b;">
                      Open inventory  →
                    </a>
                    <!--<![endif]-->
                  </td>
                </tr>
              </table>

              <!-- Tip -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:32px;background:#fafafa;border:1px solid #e4e4e7;border-radius:12px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="vertical-align:top;padding-right:12px;">
                          <div style="width:32px;height:32px;line-height:32px;text-align:center;background:#09090b;color:#fafafa;border-radius:8px;font-size:14px;font-weight:800;font-family:Georgia,serif;">i</div>
                        </td>
                        <td style="vertical-align:top;">
                          <div style="font-size:13px;font-weight:700;color:#09090b;margin-bottom:3px;letter-spacing:-0.2px;">Pro tip</div>
                          <div style="font-size:13px;line-height:1.55;color:#52525b;">
                            Adjust your minimum-quantity thresholds in product settings if these items move faster than expected — you'll get alerts earlier next time.
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer divider inside card -->
          <tr>
            <td style="padding:36px 40px 16px;" class="px-inner">
              <div style="height:1px;background:#e4e4e7;line-height:1px;font-size:0;">&nbsp;</div>
            </td>
          </tr>

          <!-- Sign-off -->
          <tr>
            <td style="padding:0 40px 36px;" class="px-inner">
              <p style="margin:0;font-size:14px;line-height:1.6;color:#52525b;">
                Thanks for running your business with us.<br>
                <span style="font-family:Georgia,'Times New Roman',serif;font-style:italic;color:#09090b;">— The BizEzy team</span>
              </p>
            </td>
          </tr>
        </table>

        <!-- Outside footer: socials + meta -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="container" style="width:600px;max-width:600px;margin:24px auto 0;">
          <tr>
            <td align="center" style="padding:8px 16px 4px;">
              <a href="${BIZEZY_TWITTER_URL}" style="display:inline-block;margin:0 6px;text-decoration:none;">
                <span style="display:inline-block;width:34px;height:34px;line-height:34px;background:#09090b;color:#ffffff;border-radius:10px;font-family:Arial,sans-serif;font-weight:800;font-size:14px;text-align:center;">X</span>
              </a>
              <a href="${BIZEZY_INSTAGRAM_URL}" style="display:inline-block;margin:0 6px;text-decoration:none;">
                <span style="display:inline-block;width:34px;height:34px;line-height:34px;background:#09090b;color:#ffffff;border-radius:10px;font-family:Arial,sans-serif;font-weight:800;font-size:12px;text-align:center;letter-spacing:0.5px;">IG</span>
              </a>
              <a href="${BIZEZY_LINKEDIN_URL}" style="display:inline-block;margin:0 6px;text-decoration:none;">
                <span style="display:inline-block;width:34px;height:34px;line-height:34px;background:#09090b;color:#ffffff;border-radius:10px;font-family:Arial,sans-serif;font-weight:800;font-size:12px;text-align:center;letter-spacing:0.5px;">in</span>
              </a>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:14px 16px 4px;">
              <p style="margin:0;font-size:12px;line-height:1.6;color:#71717a;">
                You're receiving this because you're the registered owner of <span style="color:#09090b;font-weight:600;">${safeBusinessName}</span> on BizEzy.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:8px 16px 16px;">
              <p style="margin:0;font-size:12px;line-height:1.6;color:#a1a1aa;">
                <a href="${BIZEZY_SITE_URL}" style="color:#52525b;text-decoration:none;font-weight:600;">bizezy.in</a>
                &nbsp;·&nbsp;
                <span>© ${new Date().getFullYear()} BizEzy. All rights reserved.</span>
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`,
  };
};
