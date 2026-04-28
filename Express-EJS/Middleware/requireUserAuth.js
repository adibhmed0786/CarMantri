const jwt = require("jsonwebtoken");

const requireUserAuth = (req, res, next) => {
  try {
    // Check if session exists
    if (!req.session.user) {
      return res.redirect("/login");
    }

    const token = req.cookies.userToken;

    // Verify JWT token
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET);
    }

    // Refresh session on each request (keeps user logged in)
    req.session.touch();
    return next();
  } catch (error) {
    // Clear invalid session/token
    req.session.destroy();
    res.clearCookie("userToken");
    return res.redirect("/login");
  }
};

module.exports = { requireUserAuth };
