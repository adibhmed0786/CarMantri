const express = require("express");
const {
  getLoginPage,
  getSignupPage,
  signup,
  login,
  getForgotPasswordPage,
  forgotPassword,
  getResetPasswordPage,
  resetPassword,
  logout,
} = require("../Controller/authController");

const router = express.Router();

router.get("/login", getLoginPage);
router.get("/signup", getSignupPage);
router.get("/signin", getSignupPage);
router.post("/signup", signup);
router.post("/signin", signup);
router.post("/login", login);
router.get("/forgot-password", getForgotPasswordPage);
router.post("/forgot-password", forgotPassword);
router.get("/reset-password/:token", getResetPasswordPage);
router.post("/reset-password/:token", resetPassword);
router.post("/logout", logout);

module.exports = router;
