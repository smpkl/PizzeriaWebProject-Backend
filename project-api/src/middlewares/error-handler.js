import { validationResult } from "express-validator";

const errorHandler = (err, req, res, next) => {
    console.log("ERROR HANDLER:", {
    status: err.status,
    code: err.code,
    message: err.message,
    stack: err.stack,
  });
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(400).json({
      error: {
        message: "Email is already in use",
        status: 400,
      },
    });
  }

  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
      status: err.status || 500,
    },
  });
};

const validationErrors = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((error) => `${error.path}: ${error.msg}`)
      .join(", ");
    const error = new Error(messages);
    error.status = 400;
    next(error);
    return;
  }
  next();
};

export { errorHandler, validationErrors };
