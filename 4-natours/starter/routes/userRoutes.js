// Read tours data
const express = require('express');

const router = express.Router();
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const { signup, login } = require('../controllers/authController');

router.route('/signUp').post(signup);
router.route('/login').post(login);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
