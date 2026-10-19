// AUTHORIZATION (role based): allow only the listed roles
const HttpError = require('../utils/HttpError');

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new HttpError(403, 'You do not have permission to do this'));
  }
  next();
};

// Shelters must also be approved by an admin
const requireApprovedShelter = (req, res, next) => {
  if (req.user.role === 'shelter' && !req.user.isApproved) {
    return next(new HttpError(403, 'Your shelter account is waiting for admin approval'));
  }
  next();
};

module.exports = { authorizeRoles, requireApprovedShelter };
