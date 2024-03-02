const mongoose = require("mongoose");
const validator = require("validator");
const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: [true, "id is a required field"],
  },

  title: {
    type: String,
    required: true,
    maxLength: [100, "title must have charcter less than 100"],
    minLength: [4, "ttitle must have charcter greater than 4"],
    validate: [validator.isAlpha, "title should only contain alphabets."],
    unique : true
  },
  description: {
    type: String,
    required: [true, "description is required field"],
  },
  price: {
    type: Number,
    required: true,
  },
  discountPercentage: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    default: 1.0,
    validate: {
      validator: function (val) {
        return val >= 1 && val <= 10;
      },
      message: "Rating must be between 1 and 10",
    },
  },
  stock: {
    type: Number,
    default: 10,
  },
  brand: {
    type: String,
  },
  category: {
    type: String,
  },
  thumbnail: {
    type: String,
  },
  images: {
    type: [String],
  },
});
//

const Product = mongoose.model("product", productSchema, "product");

module.exports = Product;

//  ,{
//      toJSON : { virtuals : true},
//      toObject : { virtuals : true}
//  });

//  productSchema.virtual('totalRating').get(function(){
//        return this.rating + 5 ;
//  })
