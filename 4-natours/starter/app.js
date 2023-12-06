const express = require('express');

const app = express();
const morgan = require('morgan');
const AppError = require('./utils/appError');
const appErrorController = require('./controllers/appErrorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// 1. Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode;
});
// 3. Route.
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Catch-all middleware for handling unmatched routes
// Since it lacks a specific path, this middleware will be triggered
// for any request that doesn't match the paths defined earlier with app.use()
// It returns a 404 error for routes that don't match previously defined routes.
// app.all('*', (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, '404'));
// });

// App Global Error Handler
app.use(appErrorController);

module.exports = app;
