const jwt = require("jsonwebtoken");
require('dotenv').config();

// Authentication Middleware
exports.auth = (req, res, next) => {
  try {
    const token = req.body.token || req.headers.authorization; // You can check token in header as well
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is not provided"
      });
    }
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token"
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Check if the user is an Admin
exports.isAdmin = (req, res, next) => {
  try {
    if (req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "You are not an admin"
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Check if the user is a Student
exports.isStudent = (req, res, next) => {
  try {
    if (req.user.role === "Student") {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "You are not a student"
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Check if the user is a Club Member
exports.isClub = (req, res, next) => {
  try {
    if (req.user.role === "club") {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "You are not a club member"
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
