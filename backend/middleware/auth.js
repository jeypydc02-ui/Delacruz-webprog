const jwt  = require('jsonwebtoken');
const User = require('../modules/auth/User');

// FIX 7: Fail loudly on startup if JWT_SECRET is not configured
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET environment variable is required');

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return res.status(401).json({ message: 'Not authorized. No token.' });
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User not found.' });
    next();
  } catch (err) { return res.status(401).json({ message: 'Invalid token.' }); }
};

exports.optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    }
  } catch (_) {}
  next();
};

exports.adminOnly = (req, res, next) => {
  if (!req.user || !['admin','superadmin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Admin access required.' });
  }
  next();
};
