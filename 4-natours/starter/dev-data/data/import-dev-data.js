const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');

dotenv.config({ path: '../../config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection successful!');
  });

// Read JSON FILE

let tours = fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8');
tours = JSON.parse(tours);

// Import Data to Database
const importData = async () => {
  try {
    // console.log(tours);
    await Tour.create(tours);
    console.log('Data successfully loaded!');
  } catch (e) {
    console.log(e);
  }
  process.exit();
};

// Delete All data from collection
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully loaded!');
  } catch (e) {
    console.log(e);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
