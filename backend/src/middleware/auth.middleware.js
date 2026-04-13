const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Patient = require('../models/Patient');

/**
 * Protect routes - Verify JWT token
 */
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: { message: 'Not authorized to access this route. Please log in.' }
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.userId).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { message: 'User not found' }
        });
      }

      // Check if user is active
      if (!req.user.isActive) {
        return res.status(401).json({
          success: false,
          error: { message: 'Account is deactivated' }
        });
      }

      // If user is a patient, attach patient details
      if (req.user.role === 'patient') {
        const patient = await Patient.findOne({ userId: req.user._id });
        req.patient = patient;
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: { message: 'Token is invalid or expired' }
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { message: 'Server error in authentication' }
    });
  }
};

/**
 * Authorize roles
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          message: `User role '${req.user.role}' is not authorized to access this route`
        }
      });
    }
    next();
  };
};