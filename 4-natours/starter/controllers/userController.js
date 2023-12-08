const User = require('../models/userModel');
const catchAsync = require('../utils/catchControllerAsync');

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    message: 'This route is not defined!',
    status: 'error',
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    message: 'This route is not defined!',
    status: 'error',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    message: 'This route is not defined!',
    status: 'error',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    message: 'This route is not defined!',
    status: 'error',
  });
};
