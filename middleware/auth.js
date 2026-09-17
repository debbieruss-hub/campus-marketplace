const jwt = require('jsonwebtoken');

// Verify JWT token from HTTP-only cookie
const authenticateToken = (req, res, next) => {
  // Parse cookies manually or via cookie-parser middleware
  const token = req.cookies ? req.cookies.token : null;

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No authorization token provided.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Contains user ID, email, and role
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired session token.' });
  }
};

// Role-Based Access Control (RBAC) Guard
const requireRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthenticated.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient privileges for this action.' });
    }
    next();
  };
};

module.exports = { authenticateToken, requireRole };