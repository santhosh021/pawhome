const multer = require('multer');

const notFound = (req, res) => res.status(404).json({ message: 'Route not found' });

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || 'Server error';

  if (err instanceof multer.MulterError) {
    status = 400;
    if (err.code === 'LIMIT_FILE_SIZE') message = 'Photo must be 2 MB or smaller';
  } else if (err.name === 'ValidationError') {
    status = 422; // mongoose / mongoose-unique-validator
    message = Object.values(err.errors)[0].message;
  } else if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid id';
  }

  if (status >= 500) console.error(err);
  res.status(status).json({ message });
};

module.exports = { notFound, errorHandler };
