const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../Module/User");

const getLoginPage = (req, res) => {
  if (req.session.user) {
    return res.redirect("/");
  }

  return res.render("auth/login", {
    error: null,
    message:
      req.query.reset === "success"
        ? "Password reset successful. Please log in with your new password."
        : null,
    formData: { email: "", rememberMe: false },
  });
};

const getSignupPage = (req, res) => {
  if (req.session.user) {
    return res.redirect("/");
  }

  return res.render("auth/signup", { error: null });
};

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).render("auth/signup", {
        error: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).render("auth/signup", {
        error: "User already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    req.session.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };

    res.cookie("userToken", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    return res.redirect("/");
  } catch (error) {
    return res.status(500).render("auth/signup", {
      error: "Something went wrong",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    const isJsonRequest = req.is("json");
    const shouldRemember = Boolean(rememberMe);

    const user = await User.findOne({ email });
    if (!user) {
      if (isJsonRequest) {
        return res.status(401).json({
          error: "Invalid email or password",
        });
      }
      return res.status(401).render("auth/login", {
        error: "Invalid email or password",
        message: null,
        formData: { email, rememberMe: shouldRemember },
      });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      if (isJsonRequest) {
        return res.status(401).json({
          error: "Invalid email or password",
        });
      }
      return res.status(401).render("auth/login", {
        error: "Invalid email or password",
        message: null,
        formData: { email, rememberMe: shouldRemember },
      });
    }

    const tokenExpiryMs = shouldRemember
      ? 30 * 24 * 60 * 60 * 1000
      : 60 * 60 * 1000;

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: shouldRemember ? "30d" : "1h" },
    );

    req.session.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };

    req.session.cookie.maxAge = tokenExpiryMs;

    res.cookie("userToken", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: tokenExpiryMs,
    });

    if (isJsonRequest) {
      return res.status(200).json({ message: "Login successful" });
    }
    return res.redirect("/");
  } catch (error) {
    if (req.is("json")) {
      return res.status(500).json({
        error: "Something went wrong",
      });
    }
    return res.status(500).render("auth/login", {
      error: "Something went wrong",
      message: null,
      formData: { email: "", rememberMe: false },
    });
  }
};

const getForgotPasswordPage = (_req, res) => {
  return res.render("auth/forgotPassword", {
    error: null,
    message: null,
    resetLink: null,
  });
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).render("auth/forgotPassword", {
        error: "Email is required",
        message: null,
        resetLink: null,
      });
    }

    const genericMessage =
      "If an account with that email exists, a password reset link has been generated.";
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    let resetLink = null;
    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenHash = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      user.resetPasswordToken = resetTokenHash;
      user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
      await user.save();

      resetLink = `${req.protocol}://${req.get("host")}/reset-password/${resetToken}`;
      console.log(`Password reset link for ${user.email}: ${resetLink}`);
    }

    return res.render("auth/forgotPassword", {
      error: null,
      message: genericMessage,
      resetLink: process.env.NODE_ENV === "production" ? null : resetLink,
    });
  } catch (error) {
    return res.status(500).render("auth/forgotPassword", {
      error: "Something went wrong",
      message: null,
      resetLink: null,
    });
  }
};

const getResetPasswordPage = async (req, res) => {
  try {
    const tokenHash = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).render("auth/forgotPassword", {
        error: "This password reset link is invalid or has expired.",
        message: null,
        resetLink: null,
      });
    }

    return res.render("auth/resetPassword", {
      error: null,
      token: req.params.token,
    });
  } catch (error) {
    return res.status(500).render("auth/forgotPassword", {
      error: "Something went wrong",
      message: null,
      resetLink: null,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).render("auth/resetPassword", {
        error: "Both password fields are required",
        token: req.params.token,
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).render("auth/resetPassword", {
        error: "Passwords do not match",
        token: req.params.token,
      });
    }

    if (password.length < 6) {
      return res.status(400).render("auth/resetPassword", {
        error: "Password must be at least 6 characters",
        token: req.params.token,
      });
    }

    const tokenHash = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).render("auth/forgotPassword", {
        error: "This password reset link is invalid or has expired.",
        message: null,
        resetLink: null,
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.redirect("/login?reset=success");
  } catch (error) {
    return res.status(500).render("auth/resetPassword", {
      error: "Something went wrong",
      token: req.params.token,
    });
  }
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("userToken");
    return res.redirect("/login");
  });
};

module.exports = {
  getLoginPage,
  getSignupPage,
  signup,
  login,
  getForgotPasswordPage,
  forgotPassword,
  getResetPasswordPage,
  resetPassword,
  logout,
};
