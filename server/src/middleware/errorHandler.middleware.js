import APIerror from "../utils/API-Error.js";

export const notFound = (req, res, next) => {
  next(new APIerror(404, `Route not found ${req.originalUrl}`))
}

export const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Server error";
  let errors = [];

  if (err instanceof APIerror) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;

  } else if (err.code === 11000) { // MongoDB duplicate-key error
    const field = Object.keys(err.keyValue[0])
    console.log(field)
    statusCode = 400;
    message = `The ${field} is already in use`

  } else if (err.name === "ValidationError") { // Mongoose schema validation error
    statusCode = 400;
    message = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ")

  } else if (err.name === "CastError") { // Mongoose invalid ObjectId / type conversion error
    message = err.path === "_id" ? "Invalid ID" : `Invalid value for ${err.path}`

  } else if (err.type === "entity.parse.failed") { // Express JSON body parsing error
    statusCode = 400;
    message = "Invalid JSON in request body"

  } else {
    console.log("Err in erroHandler.middleware.js", err)
  }

  res.status(statusCode).json({
    statusCode,
    success: false,
    message,
    errors
  })
}