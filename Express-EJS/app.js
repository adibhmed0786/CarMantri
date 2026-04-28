require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const webRoutes = require("./routes/webRoutes");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const connectDB = require("./Config/db");
const adminRoutes = require("./routes/adminRoutes");
const superAdminRoutes = require("./routes/superAdminRoutes");
const authRoutes = require("./routes/authRoutes");
const apiRoutes = require("./routes/apiRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

connectDB();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "express_ejs_admin_secret",
    resave: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    },
  }),
);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.admin = req.session.admin || null;
  res.locals.superAdmin = req.session.superAdmin || null;
  // Refresh session on each request (keeps session alive)
  if (req.session.user || req.session.admin || req.session.superAdmin) {
    req.session.touch();
  }
  next();
});

app.use(express.static(path.join(__dirname, "public")));
app.use("/", authRoutes);
app.use("/api", apiRoutes);
app.use("/bookings", bookingRoutes);
app.use("/", webRoutes);
app.use("/admin", adminRoutes);
app.use("/superadmin", superAdminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} http://localhost:${PORT}`);
});
