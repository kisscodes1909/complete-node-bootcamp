const Tour = require('../models/tourModel');

// Route Handler
exports.getTours = async (req, res) => {
  try {
    // 1.Building The Query
    const queryObj = { ...req.query };

    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let { page, sort, limit, fields } = req.query;

    // 2.1.Advanced filter
    let queryString = JSON.stringify(queryObj);

    queryString = queryString.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`,
    );

    let query = Tour.find(JSON.parse(queryString));

    // 2.2 Sorting

    console.log(sort);

    if (sort) {
      sort = sort.split(',').join(' ');
      query = query.sort(sort);
    }

    // // 3. Execute query
    const tours = await query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (e) {
    // console.log(e);
    res.send(404).json({
      status: 'fail',
      message: e,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: 'fail',
      message: e,
    });
  }
};

exports.getTour = async (req, res) => {
  const { id } = req.params;

  try {
    const tour = await Tour.findById(id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (e) {
    res.send(404).json({
      status: 'fail',
      message: e,
    });
  }
};

exports.updateTour = async (req, res) => {
  const { id } = req.params;

  try {
    console.log(req.body);
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (e) {
    res.send(404).json({
      status: 'fail',
      message: e,
    });
  }
};

exports.deleteTour = async (req, res) => {
  const { id } = req.params;

  try {
    await Tour.findByIdAndDelete(id, {});
    res.status(200).json({
      status: 'success',
      data: null,
    });
  } catch (e) {
    res.send(404).json({
      status: 'fail',
      message: e,
    });
  }
};
