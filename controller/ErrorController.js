const customError = require("../utilis/customError");

const devErrors = (res, error) => {
  return res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};
const prodErrors = (res, error) => {
  //   console.log(error);
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong..Pls try again later.",
    });
  }
};

const castErrorHandler = (error) => {
  let msg = `invalid data value ${error.value} for field ${error.path}`;
  return new customError(msg, 400);
};

const duplicateKeyErrorHandler = (error) => {
  let message = `admin already Exists with this email ${error.keyValue.email}`;
  return new customError(message, 400);
};

const validationErrorHandler = (error) => {
  const errors = Object.values(error.errors).map((val) => val.message);
  //  console.log(errors)
  const errMessage = errors.join(". ");
  const msg = `invalid input : ${errMessage} `;

  return new customError(msg, 400);
};
 
const referenceErrorHandler = (error)=>{
      let msg = `${error.name} :  ${error.message}`;

      return new customError(msg,400);
} 

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
     console.log(error.name)
    devErrors(res, error);
  } else if (process.env.NODE_ENV === "production") {
    // console.log(error.name);

    if (error.name === "CastError") {
      error = castErrorHandler(error);
    } else if (error.code == 11000) {
      error = duplicateKeyErrorHandler(error);
    } else if (error.name === "ValidationError") {
      // console.log(error.name)
      error = validationErrorHandler(error);
    }else if(error.name === 'ReferenceError'){
       error =referenceErrorHandler(error)
    }

    prodErrors(res, error);
  }
};
