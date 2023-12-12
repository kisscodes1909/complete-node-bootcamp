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

exports.protectRoute = catchAsync(async (req, res, next) => {
  //1. Get Token
  // console.log(req.headers);

  const token =
    req.headers.hasOwnProperty('authorization') &&
    req.headers.authorization.startsWith('Bear')
      ? req.headers.authorization.split(' ')[1]
      : null;

  if (!token) {
    next(new AppError('Please logged in!', 401));
  }

  //2. Verify Token
  const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);

  //3. Check user still exist
  const user = await User.findById(tokenDecoded.id);

  if (!user) {
    next(new AppError('User is not exist', 401));
  }

  //4. Check user change password after issue token
  // The logic is compare token iat(Issue Token at) vs Password change at.

  //4.1 Need a Update Password Timestamp in user model
  //4.2 When user update password and update password timestamp
  //4.3 When user request then check
  const passwordChanged = user.changePasswordAfter(tokenDecoded.iat);

  if (passwordChanged) {
    next(new AppError('The password is changed, please try login again!', 401));
  }

  next();
});
