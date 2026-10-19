const bcrypt = require('bcrypt');
const User = require('../models/User');

// Creates the first admin from ADMIN_EMAIL / ADMIN_PASSWORD (only if no admin exists)
module.exports = async function seedAdmin() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return;
  if (await User.exists({ role: 'admin' })) return;
  await User.create({
    name: 'Admin',
    email: ADMIN_EMAIL,
    password: await bcrypt.hash(ADMIN_PASSWORD, 10),
    role: 'admin',
  });
  console.log(`Admin account created: ${ADMIN_EMAIL}`);
};
