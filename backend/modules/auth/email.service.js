const nodemailer = require('nodemailer');

const createTransporter = () => nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const baseEmailWrapper = (content) => `
<!DOCTYPE html><html><head><meta charset="utf-8"><style>
body{margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif}
.wrapper{max-width:520px;margin:40px auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)}
.header{background:#1a1a2e;padding:32px 40px;text-align:center}
.logo{font-size:28px;font-weight:900;color:#e8c547;letter-spacing:-1px}
.tagline{color:rgba(255,255,255,0.5);font-size:11px;letter-spacing:3px;text-transform:uppercase;margin-top:4px}
.body{padding:40px}
.greeting{font-size:18px;font-weight:600;color:#1a1a2e;margin-bottom:12px}
.text{font-size:14px;color:#666;line-height:1.6;margin-bottom:28px}
.code-box{background:#1a1a2e;border-radius:10px;padding:24px;text-align:center;margin:24px 0}
.code{font-size:42px;font-weight:900;color:#e8c547;letter-spacing:10px;font-family:monospace}
.expiry{font-size:12px;color:rgba(255,255,255,0.4);margin-top:8px}
.footer{background:#f5f5f5;padding:20px 40px;text-align:center}
.footer-text{font-size:11px;color:#999}
</style></head><body><div class="wrapper">${content}</div></body></html>`;

const sendVerificationEmail = async (toEmail, firstName, code) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`\n📧 [DEV MODE] Verification code for ${toEmail}: ${code}\n`);
    return { success: true, devMode: true };
  }
  const html = baseEmailWrapper(`
    <div class="header"><div class="logo">JEYP</div><div class="tagline">Just Elevate Your Performance</div></div>
    <div class="body">
      <div class="greeting">Hi ${firstName}! 👋</div>
      <p class="text">Welcome to JEYP Store! To complete your registration, please use the verification code below. This code expires in <strong>10 minutes</strong>.</p>
      <div class="code-box"><div class="code">${code}</div><div class="expiry">Expires in 10 minutes</div></div>
      <p class="text">If you didn't create a JEYP account, you can safely ignore this email.</p>
    </div>
    <div class="footer"><p class="footer-text">© 2026 JEYP Store · Philippines</p></div>
  `);
  await createTransporter().sendMail({
    from: `"JEYP Store" <${process.env.EMAIL_USER}>`,
    to: toEmail, subject: `${code} is your JEYP verification code`, html,
  });
  return { success: true };
};

// FIX 4: Password reset email
const sendPasswordResetEmail = async (toEmail, firstName, code) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`\n🔑 [DEV MODE] Password reset code for ${toEmail}: ${code}\n`);
    return { success: true, devMode: true };
  }
  const html = baseEmailWrapper(`
    <div class="header"><div class="logo">JEYP</div><div class="tagline">Just Elevate Your Performance</div></div>
    <div class="body">
      <div class="greeting">Password Reset Request</div>
      <p class="text">Hi ${firstName}, we received a request to reset your JEYP account password. Use the code below — it expires in <strong>15 minutes</strong>.</p>
      <div class="code-box"><div class="code">${code}</div><div class="expiry">Expires in 15 minutes</div></div>
      <p class="text">If you didn't request a password reset, you can safely ignore this email. Your password will not change.</p>
    </div>
    <div class="footer"><p class="footer-text">© 2026 JEYP Store · Philippines</p></div>
  `);
  await createTransporter().sendMail({
    from: `"JEYP Store" <${process.env.EMAIL_USER}>`,
    to: toEmail, subject: `${code} is your JEYP password reset code`, html,
  });
  return { success: true };
};


// Order confirmation email
const sendOrderConfirmationEmail = async (toEmail, firstName, order) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`\n📦 [DEV MODE] Order confirmation for ${toEmail}: ${order.orderNumber}\n`);
    return { success: true, devMode: true };
  }

  const itemRows = order.items.map(item => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#333">${item.name}</td>
      <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#666;text-align:center">${item.quantity}</td>
      <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#333;text-align:right">₱${item.price.toLocaleString()}</td>
    </tr>
  `).join('');

  const statusBadgeColor = {
    pending: '#f59e0b', confirmed: '#3b82f6', processing: '#8b5cf6',
    shipped: '#6366f1', delivered: '#10b981', cancelled: '#ef4444',
  };

  const html = baseEmailWrapper(`
    <div class="header"><div class="logo">JEYP</div><div class="tagline">Order Confirmation</div></div>
    <div class="body">
      <div class="greeting">Thank you, ${firstName}! 🎉</div>
      <p class="text">Your order has been received and is being processed. Here are your order details:</p>
      <div style="background:#f8f8f8;border-radius:8px;padding:16px 20px;margin-bottom:20px">
        <p style="margin:0 0 4px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:1px">Order Number</p>
        <p style="margin:0;font-size:22px;font-weight:900;color:#1a1a2e;letter-spacing:-0.5px">${order.orderNumber}</p>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
        <thead>
          <tr>
            <th style="text-align:left;font-size:11px;color:#999;text-transform:uppercase;padding-bottom:8px">Item</th>
            <th style="text-align:center;font-size:11px;color:#999;text-transform:uppercase;padding-bottom:8px">Qty</th>
            <th style="text-align:right;font-size:11px;color:#999;text-transform:uppercase;padding-bottom:8px">Price</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>
      <div style="text-align:right;padding-top:12px;border-top:2px solid #1a1a2e">
        <span style="font-size:18px;font-weight:900;color:#1a1a2e">Total: ₱${order.total.toLocaleString()}</span>
      </div>
      <div style="margin-top:24px;padding:16px;background:#f0f4ff;border-radius:8px">
        <p style="margin:0 0 8px;font-size:12px;color:#666;font-weight:600">SHIPPING TO</p>
        <p style="margin:0;font-size:13px;color:#333">${order.shippingAddress?.street}, ${order.shippingAddress?.city}, ${order.shippingAddress?.province} ${order.shippingAddress?.zip}</p>
      </div>
      <p class="text" style="margin-top:24px">Payment Method: <strong>${order.paymentMethod}</strong></p>
      <p class="text">We'll send you another email once your order status changes. You can also check your order status anytime in your account.</p>
    </div>
    <div class="footer"><p class="footer-text">© 2026 JEYP Store · Philippines</p></div>
  `);

  await createTransporter().sendMail({
    from: `"JEYP Store" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Order ${order.orderNumber} Confirmed – JEYP Store`,
    html,
  });
  return { success: true };
};

// Order status update email
const sendOrderStatusUpdateEmail = async (toEmail, firstName, order, newStatus) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`\n🔄 [DEV MODE] Status update email for ${toEmail}: ${order.orderNumber} → ${newStatus}\n`);
    return { success: true, devMode: true };
  }

  const statusMessages = {
    confirmed:  { label: 'Order Confirmed ✅',   msg: 'Your order has been confirmed and is being prepared.' },
    processing: { label: 'Being Processed 📦',   msg: 'Your order is currently being packed and prepared for shipment.' },
    shipped:    { label: 'Order Shipped 🚚',      msg: 'Great news! Your order is on its way. Expect it to arrive soon.' },
    delivered:  { label: 'Order Delivered 🎉',   msg: 'Your order has been delivered. We hope you love your JEYP products!' },
    cancelled:  { label: 'Order Cancelled ❌',   msg: 'Your order has been cancelled. If you have questions, please contact us.' },
    pending:    { label: 'Order Pending ⏳',     msg: 'Your order is pending. We will update you shortly.' },
  };

  const info = statusMessages[newStatus] || { label: `Status: ${newStatus}`, msg: 'Your order status has been updated.' };

  const html = baseEmailWrapper(`
    <div class="header"><div class="logo">JEYP</div><div class="tagline">Order Update</div></div>
    <div class="body">
      <div class="greeting">Hi ${firstName}!</div>
      <p class="text">Your order status has been updated.</p>
      <div style="background:#f8f8f8;border-radius:8px;padding:16px 20px;margin-bottom:20px">
        <p style="margin:0 0 4px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:1px">Order Number</p>
        <p style="margin:0;font-size:22px;font-weight:900;color:#1a1a2e">${order.orderNumber}</p>
      </div>
      <div class="code-box" style="padding:20px">
        <div style="font-size:20px;font-weight:900;color:#e8c547;letter-spacing:0">${info.label}</div>
      </div>
      <p class="text" style="margin-top:20px">${info.msg}</p>
      ${newStatus === 'delivered' ? '<p class="text">Thank you for shopping with JEYP! 🙏 We\'d love to hear your feedback.</p>' : ''}
    </div>
    <div class="footer"><p class="footer-text">© 2026 JEYP Store · Philippines</p></div>
  `);

  await createTransporter().sendMail({
    from: `"JEYP Store" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `${info.label} – Order ${order.orderNumber}`,
    html,
  });
  return { success: true };
};

module.exports = { generateOTP, sendVerificationEmail, sendPasswordResetEmail, sendOrderConfirmationEmail, sendOrderStatusUpdateEmail };
