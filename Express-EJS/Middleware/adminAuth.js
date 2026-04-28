const jwt = require("jsonwebtoken");

const verifyAdmin = (req, res, next) => {
  try {
    // Check if session exists
    if (!req.session.admin) {
      return res.redirect("/admin/login");
    }

    const token = req.cookies.adminToken;

    // Verify JWT token
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET);
    }

    // Refresh session on each request
    req.session.touch();
    req.admin = { id: req.session.admin.id };
    return next();
  } catch (error) {
    // Clear invalid session/token
    req.session.destroy();
    res.clearCookie("adminToken");
    return res.redirect("/admin/login");
  }
};

module.exports = { verifyAdmin };
