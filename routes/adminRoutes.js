const express = require("express");
const adminRoutes = express.Router();
const upload = require("../Helpers/multer");
const verifyToken = require("../Helpers/tokenverify");

const {
  adminSignUp,
  adminLogin,
  deleteAdmin,
  updateAdmin,
  adminProfile,
} = require("../controller/adminController");

adminRoutes.route("/login").post(adminLogin);

adminRoutes
  .route("/")
  .post(upload.single("profileImage"), adminSignUp)
  .get(verifyToken, adminProfile)
  .patch(verifyToken, updateAdmin)
  .delete(verifyToken, deleteAdmin);

module.exports = adminRoutes;
