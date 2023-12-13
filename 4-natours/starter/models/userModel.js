const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: ['Please enter your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    minlength: 8,
    validate: {
      // This not work for update and only work CREATE and SAVE!!!
      validator: function (passwordConfirm) {
        return this.password === passwordConfirm;
      },
      message: 'Please enter the value same the password!',
    },
  },
  passwordChangeAt: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.correctPassword = async function (
  plainPassword,
  hashPassword,
) {
  return await bcrypt.compare(plainPassword, hashPassword);
};

userSchema.methods.changePasswordAfter = function (jwtIssueAt) {
  if (this.passwordChangeAt) {
    const passwordChangeAtTimestamp = this.passwordChangeAt.getTime() / 1000;
    return passwordChangeAtTimestamp > jwtIssueAt;
  }

  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
