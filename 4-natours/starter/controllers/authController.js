const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchControllerAsync');
const AppError = require('../utils/appError');

const signToken = (userId) =>
  jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  // 1. Get email, password
  const { email, password } = req.body;
  // console.log(email, password);
  // 2. Check email exist
  const user = await User.findOne({ email }).select('+password');

  // 3. Compare Password
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('The email or password is not correct!', 401));
  }

  // 4. Sign JWT token
  const token = signToken(user._id);

  // 5. Response to client
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: user,
    },
  });
});
