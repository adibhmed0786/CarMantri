const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../Module/Admin");
const Service = require("../Module/Service");

const getLoginPage = (req, res) => {
  if (req.session.admin) {
    return res.redirect("/admin/dashboard");
  }

  res.render("admin/login", { error: null });
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).render("admin/login", {
        error: "Invalid credentials",
      });
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return res.status(401).render("admin/login", {
        error: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    req.session.admin = {
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };

    res.cookie("adminToken", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    return res.redirect("/admin/dashboard");
  } catch (error) {
    return res.status(500).render("admin/login", {
      error: "Something went wrong",
    });
  }
};

const getDashboard = async (req, res) => {
  const pageSize = 12;
  try {
    const services = await Service.find({ addedBy: req.admin.id })
      .select("name description image price createdAt")
      .sort({ createdAt: -1 })
      .limit(pageSize + 1)
      .lean();

    const hasMore = services.length > pageSize;
    const initialServices = hasMore ? services.slice(0, pageSize) : services;

    return res.render("admin/dashboard", {
      admin: req.session.admin,
      initialServices,
      initialHasMore: hasMore,
    });
  } catch (error) {
    return res.render("admin/dashboard", {
      admin: req.session.admin,
      initialServices: [],
      initialHasMore: false,
      error: "Failed to load services",
    });
  }
};

const logoutAdmin = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("adminToken");
    return res.redirect("/admin/login");
  });
};

module.exports = {
  getLoginPage,
  loginAdmin,
  getDashboard,
  logoutAdmin,
};
