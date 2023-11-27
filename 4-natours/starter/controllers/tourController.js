const Tour = require('../models/tourModel');

// Route Handler
exports.getTours = async (req, res) => {
  try {
    // 1.Building The Query
    const queryObj = { ...req.query };

    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let { sort } = req.query;

    // 2.1.Advanced filter
    let queryString = JSON.stringify(queryObj);

    queryString = queryString.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`,
    );

    let query = Tour.find(JSON.parse(queryString));

    // 2.2 Sorting
    if (sort) {
      sort = sort.split(',').join(' ');
      query = query.sort(sort);
    }

    // 3. Execute query
    if (req.query.fields) {
      const fields = req.query.fields.split(',');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // 4. Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) {
        throw new Error('This page does not exists');
      }
    }

    query = query.skip(skip).limit(limit);

    const tours = await query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (e) {
    res.status(404).json({
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
