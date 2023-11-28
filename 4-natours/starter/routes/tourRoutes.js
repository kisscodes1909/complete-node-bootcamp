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
} = require('../controllers/tourController');

router.route('/tour-stats').get(getTourStats);
router.route('/top-5-cheap').get(top5CheapTour, getTours);
router.route('/').get(getTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
