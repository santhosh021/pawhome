const User = require('../models/User');
const Pet = require('../models/Pet');
const Application = require('../models/Application');
const HttpError = require('../utils/HttpError');
const { removeFile } = require('../config/upload');

exports.stats = async (req, res) => {
  const [users, shelters, pendingShelters, pets, applications] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'shelter' }),
    User.countDocuments({ role: 'shelter', isApproved: false }),
    Pet.countDocuments(),
    Application.countDocuments(),
  ]);
  res.json({ stats: { users, shelters, pendingShelters, pets, applications } });
};

exports.users = async (req, res) => {
  const users = await User.find().sort('-createdAt');
  res.json({ users });
};

exports.approve = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new HttpError(404, 'User not found');
  if (user.role !== 'shelter') throw new HttpError(400, 'Only shelter accounts need approval');
  user.isApproved = true;
  await user.save();
  res.json({ user });
};

exports.removeUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new HttpError(404, 'User not found');
  if (user.role === 'admin') throw new HttpError(400, 'Admin accounts cannot be deleted');

  if (user.role === 'shelter') {
    const pets = await Pet.find({ shelter: user._id });
    pets.forEach((p) => removeFile(p.photo));
    await Application.deleteMany({ pet: { $in: pets.map((p) => p._id) } });
    await Pet.deleteMany({ shelter: user._id });
  }
  await Application.deleteMany({ adopter: user._id });
  await user.deleteOne();
  res.json({ message: 'User deleted' });
};
