const express = require("express");
const {
  getSuperAdminLogin,
  loginSuperAdmin,
  getSuperAdminDashboard,
  createAdminCredentials,
  deleteAdmin,
  logoutSuperAdmin,
} = require("../Controller/superAdminController");
const { verifySuperAdmin } = require("../Middleware/superAdminAuth");

const router = express.Router();

router.get("/login", getSuperAdminLogin);
router.post("/login", loginSuperAdmin);
router.get("/dashboard", verifySuperAdmin, getSuperAdminDashboard);
router.post("/admins", verifySuperAdmin, createAdminCredentials);
router.post("/admins/:id/delete", verifySuperAdmin, deleteAdmin);
router.post("/logout", verifySuperAdmin, logoutSuperAdmin);

module.exports = router;
