const dotenv = require('dotenv');
const mongoose = require('mongoose');

// process.on('unhandledRejection', (error) => {
//   console.log(error.message);
//   console.log('UNHANDLED INJECTION');
//   server.close(() => {
//     process.exit(1);
//   });
// });
//
// process.on('uncaughtException', (error) => {
//   console.log(error.message);
//   console.log('UNCAUGHT INJECTION');
//   server.close(() => {
//     process.exit(1);
//   });
// });

dotenv.config({ path: './config.env' });

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

const app = require('./app');

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
