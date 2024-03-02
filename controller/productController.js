const Product = require("../model/productModel");
const { asyncHandler } = require("../utilis/asyncHandler");
const customError = require("../utilis/customError");

// exports.getProducts = asyncHandler(async (req, res, next) => {

//         let queryStr = JSON.stringify(req.query);
//         queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
//         let queryObj = JSON.parse(queryStr);
//         console.log(queryObj);

//         let query =  Product.find(queryObj);

//         if (!query) {
//             return next(new Error("Products not found.."));
//         }

//         // if (req.query.sort) {
//         //     const sortFields = req.query.sort.split(',').join(' ');
//         //     query = query.sort(sortFields);
//         // }

//             if (req.query.fields) {
//                 const fields = req.query.fields.split(',').join(' ');
//                 query = query.select(fields);
//             }

//         const products = await query;

//         return res.status(200).json({
//             status: 'success',
//             length: products.length,
//             data: {
//                 products
//             }
//         });

//     } )

exports.getProducts = asyncHandler(async (req, res, next) => {
  let product = await Product.aggregate([
    { $match: { price: { $gte: 100 } } },
    {
      $group: {
        _id: "$brand",
        total: { $sum: 1 },
        totalPrice: { $sum: "$price" },
        avgPrice: { $avg: "$price" },
        price: { $push: "$price" },
        Description: { $push: "$description" },

        maxPrice: { $max: "$price" },
        minPrice: { $min: "$price" },
        // name : { $push : '$brand'}
      },
    },
    { $sort: { price: 1 } },
    // {
    //     $project : {
    //          name : 1 ,
    //          price :1,
    //          Description :1
    //     }
    // },
    {
      $unwind: "$price",
    },
    { $addFields: { company: "$_id" } },
    {
      $project: {
        _id: 0,
      },
    },
  ]);

  return res.status(200).json({
    status: "success",
    length: product.length,
    requestedAt: new Date(),
    data: {
      product,
    },
  });
});

exports.getByCompanyName = asyncHandler(async (req, res) => {
  let company = req.query.company;
  let product = await Product.aggregate([{ $match: { brand: company } }]);

  if(!product) return next(new customError('Product not found',404))

  return res.status(200).json({
    status: "success",
    data: { product },
  });
});

exports.addProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.body;

  let product = await Product.findOne({ id });
  if (product) {
    return next(new customError("Product already exists with this id.",400));
  }

  product = await Product.create(req.body);
  if (!product) {
    return next(new customError("Failed to add product..",400));
  }
  return res.status(201).json({
    status: "success",
    Data: {
      product,
    },
  });
});


exports.getProducyById = asyncHandler(async(req,res,next)=>{
      
      const { _id} = req.query;
      const product = await Product.findById(_id);

      // console.log(x) => Reference Error

      if(!product) return next(new customError('product not found with this id',404));
      return res.status(200).json({
        status : 'success',
        message : {
            product
        }
      })
     
})