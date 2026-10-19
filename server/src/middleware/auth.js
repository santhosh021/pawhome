// AUTHENTICATION: verifies the JWT and loads the user
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const HttpError = require('../utils/HttpError');

async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw new HttpError(401, 'Authentication required');

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      throw new HttpError(401, 'Invalid or expired token');
    }

    const user = await User.findById(payload.id);
    if (!user) throw new HttpError(401, 'User no longer exists');
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = auth;
