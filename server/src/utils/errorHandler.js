import ApiError from "./ApiError.js";

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.ststus(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  console.log(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal, Server Error",
  });
};

export default errorHandler;
