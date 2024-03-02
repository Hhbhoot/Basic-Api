const mongoose = require("mongoose");
const validator = require('validator');
const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required field"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required field"],
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "is invalid"],
      unique: true,
      validate : validator.isEmail
    },
    password: {
      type: String,
      required: [true, "password is required field"],
      select: false,
    },
    profileImage: {
      type: String,
      default: null,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
  { timestamps: true }
);

adminSchema.virtual("NameInCapital").get(function () {
  return this.name.toUpperCase();
});

const Admin = mongoose.model("admin", adminSchema);

module.exports = Admin;
