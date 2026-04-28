const verifySuperAdmin = (req, res, next) => {
  if (!req.session.superAdmin) {
    return res.redirect("/superadmin/login");
  }
  return next();
};

module.exports = { verifySuperAdmin };
