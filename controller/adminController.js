const Admin = require("../model/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {asyncHandler} = require("../utilis/asyncHandler");
const customError = require("../utilis/customError");

exports.adminSignUp = asyncHandler(async (req, res,next) => {
  const { name, email, password, confirmPassword } = req.body;

  let admin = await Admin.findOne({ email });
   
  if (password !== confirmPassword) {
    return res.status(400).json({
      status: "fail",
      message: "Password and confirmPassword are not matching.",
    });
  }

  if (req.file) {
    req.body.profileImage = `${req.file.path.replace(/\\/, "/")}`;
  }
  let hashPassword = await bcrypt.hash(password, 12);
  admin = await Admin.create({
    name,
    email,
    password: hashPassword,
    profileImage: req.body.profileImage,
  });

  return res.status(201).json({
    status: "success",
    Data: {
      admin,
    },
  });
});

exports.adminLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  let admin = await Admin.findOne({ email }).select("+password");
  if (!admin) {
    return next(new customError("Email not found", 404));
  }
  let checkPassword = await bcrypt.compare(password, admin.password);
  if (!checkPassword) {
    return next(new customError("Incorrect password.", 401));
  }
  const payload = {
    userId: admin._id,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);

  return res.status(200).json({
    status: "success",
    message: "login successfully..",
    token: token,
  });
});

exports.adminProfile = asyncHandler(async (req, res, next) => {
  const id = req.user._id;
  let admin = await Admin.findById(id).select("-__v -_id");

  if (!admin) {
    next(new customError("Admin not found with this id", 404));
  }

  return res.status(200).json({
    status: "success",
    data: {
      admin,
    },
  });
});

exports.updateAdmin = asyncHandler( async (req, res,next) => {

    let id = req.user._id;
    let updateAdmin = await Admin.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).select("-__v -_id");

    if (!updateAdmin)   return next(new customError('admin not found..',404))
         
    return res.status(200).json({
      message: "success",
      Data: {
        updateAdmin,
      },
    });
  });

exports.deleteAdmin = asyncHandler(async (req, res,next) => {
 
    let admin = await Admin.findByIdAndDelete(req.user._id);
    if (!admin) {
         return next (new customError('failed to delete admin',400))
    }
    return res.status(200).json({
      status: "success",
      data: null,
    });
  } );
