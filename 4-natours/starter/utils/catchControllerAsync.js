// Mục tiêu là phải loại bỏ catch block từ controller
// Catch lỗi và đưa lỗi đến global error handler.
// Dựa vào catch promisse
// catchAsync là high order function
// Sử dụng high order function để bắt lỗi và trả về function xử lý lỗi
module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch((error) => {
    next(error);
  });
};
