const express = require('express');

const router = express.Router();
const {
  getTour,
  getTours,
  createTour,
  deleteTour,
  updateTour,
} = require('../controllers/tourController');

router.route('/').get(getTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
