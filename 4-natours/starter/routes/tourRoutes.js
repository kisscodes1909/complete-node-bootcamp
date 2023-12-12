const express = require('express');

const router = express.Router();
const {
  getTour,
  getTours,
  createTour,
  deleteTour,
  updateTour,
  top5CheapTour,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tourController');

const { protectRoute } = require('../controllers/authController');

router.route('/monthly-plan/:year').get(getMonthlyPlan);
router.route('/tour-stats').get(getTourStats);
router.route('/top-5-cheap').get(top5CheapTour, getTours);
router.route('/').get(protectRoute, getTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
