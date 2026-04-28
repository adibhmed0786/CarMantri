const bcrypt = require("bcryptjs");
const Admin = require("../Module/Admin");

const SUPERADMIN_EMAIL = "adib@gmail.com";
const SUPERADMIN_PASSWORD = "adib123";

const getSuperAdminLogin = (req, res) => {
  if (req.session.superAdmin) {
    return res.redirect("/superadmin/dashboard");
  }
  return res.render("superadmin/login", { error: null });
};

const loginSuperAdmin = async (req, res) => {
  try {
    const email = String(req.body?.email || "")
      .trim()
      .toLowerCase();
    const password = String(req.body?.password || "").trim();
    const expectedEmail = SUPERADMIN_EMAIL.trim().toLowerCase();
    const expectedPassword = SUPERADMIN_PASSWORD.trim();

    if (email !== expectedEmail || password !== expectedPassword) {
      return res.status(401).render("superadmin/login", {
        error: "Invalid super admin credentials",
      });
    }

    req.session.superAdmin = {
      email: SUPERADMIN_EMAIL,
      role: "superadmin",
    };

    return res.redirect("/superadmin/dashboard");
  } catch (error) {
    return res.status(500).render("superadmin/login", {
      error: "Something went wrong",
    });
  }
};

const getSuperAdminDashboard = async (req, res) => {
  try {
    const admins = await Admin.find().sort({ createdAt: -1 });
    return res.render("superadmin/dashboard", {
      admins,
      superAdmin: req.session.superAdmin,
      error: null,
      success: null,
    });
  } catch (error) {
    return res.status(500).render("superadmin/dashboard", {
      admins: [],
      superAdmin: req.session.superAdmin,
      error: "Failed to load admins",
      success: null,
    });
  }
};

const createAdminCredentials = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      const admins = await Admin.find().sort({ createdAt: -1 });
      return res.status(400).render("superadmin/dashboard", {
        admins,
        superAdmin: req.session.superAdmin,
        error: "Name, email and password are required",
        success: null,
      });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      const admins = await Admin.find().sort({ createdAt: -1 });
      return res.status(400).render("superadmin/dashboard", {
        admins,
        superAdmin: req.session.superAdmin,
        error: "Admin with this email already exists",
        success: null,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await Admin.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    const admins = await Admin.find().sort({ createdAt: -1 });
    return res.render("superadmin/dashboard", {
      admins,
      superAdmin: req.session.superAdmin,
      error: null,
      success: "Admin credentials generated successfully",
    });
  } catch (error) {
    const admins = await Admin.find().sort({ createdAt: -1 });
    return res.status(500).render("superadmin/dashboard", {
      admins,
      superAdmin: req.session.superAdmin,
      error: "Failed to create admin",
      success: null,
    });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    return res.redirect("/superadmin/dashboard");
  } catch (error) {
    return res.redirect("/superadmin/dashboard");
  }
};

const logoutSuperAdmin = (req, res) => {
  req.session.superAdmin = null;
  return res.redirect("/superadmin/login");
};

module.exports = {
  getSuperAdminLogin,
  loginSuperAdmin,
  getSuperAdminDashboard,
  createAdminCredentials,
  deleteAdmin,
  logoutSuperAdmin,
};
