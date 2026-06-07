const { registerUser, verifyEmail, resendVerification, loginUser, changePassword, forgotPassword, resetPassword } = require('./auth.service');
const User = require('./User');

exports.register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    if (!email || !password || !firstName || !lastName)
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    const result = await registerUser(email, password, firstName, lastName, phone);
    res.status(201).json({ success: true, ...result });
  } catch (err) { next(err); }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ success: false, message: 'Email and code required.' });
    const result = await verifyEmail(email, code);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

exports.resendCode = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await resendVerification(email);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required.' });
    const result = await loginUser(email, password);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password -verifyCode -verifyCodeExpiry -resetCode -resetCodeExpiry');
  res.json({ success: true, user });
};

exports.updateMe = async (req, res, next) => {
  try {
    const allowed = ['firstName', 'lastName', 'phone', 'addresses'];
    const updates = {};
    allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true })
      .select('-password -verifyCode -verifyCodeExpiry -resetCode -resetCodeExpiry');
    res.json({ success: true, user });
  } catch (err) { next(err); }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await changePassword(req.user.id, currentPassword, newPassword);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

// FIX 4: Forgot password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required.' });
    const result = await forgotPassword(email);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

// FIX 4: Reset password
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword)
      return res.status(400).json({ success: false, message: 'Email, code, and new password are required.' });
    const result = await resetPassword(email, code, newPassword);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};
