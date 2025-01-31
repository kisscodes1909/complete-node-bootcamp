class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode.toString();
    this.status = this.statusCode.startsWith('4') ? 'Failed' : 'Error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
