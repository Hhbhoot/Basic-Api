const jwt = require("jsonwebtoken");
const Admin = require("../model/adminModel");

const verifyToken = async (req, res, next) => {
  try {
    let token = await req.headers["authorization"].split(" ")[1];
    if (!token)
      return res
        .status(404)
        .json({ status: "fail", message: "Token not found.." });
    let { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = await Admin.findById(userId);

    if (req.user) {
      next();
    } else {
      return res.status(401).json({
        status: "fail",
        message: "unauthorized admin..",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

module.exports = verifyToken;
