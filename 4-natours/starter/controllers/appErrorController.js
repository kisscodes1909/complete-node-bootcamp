const AppError = require('../utils/appError');

const sendErrorDev = (res, error) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stack: error.stack,
    error,
  });
};

const sendErrorProduction = (res, error) => {
  // Operational, trusted error: send message to client
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });

    // Programing or other unknown error: don't leak error details
  } else {
    console.error('Error', error);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

const handleInvalidIDDB = (error) => {
  const { value } = error;
  return new AppError(`The ${value} id is not valid`, 400);
};

const handleMongoDuplicateDocument = (error) => {
  const { keyValue } = error;
  return new AppError(`The ${keyValue.name} was duplicated`, 400);
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'Error';

  if (process.env.NODE_ENV === 'development') {
    // Handle MongoDB Error.
    sendErrorDev(res, error);
  } else if (process.env.NODE_ENV === 'production') {
    const { name: errorName, code } = error;

    if (errorName === 'CastError') error = handleInvalidIDDB(error);

    if (errorName === 'MongoError' && code === 11000)
      error = handleMongoDuplicateDocument(error);

    if (errorName === 'ValidationError') {
      error = new AppError(error.message, 400);
    }

    sendErrorProduction(res, error);
  }
};
