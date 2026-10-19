const Application = require('../models/Application');
const Pet = require('../models/Pet');
const HttpError = require('../utils/HttpError');

// Adopter: apply for a pet
exports.create = async (req, res) => {
  const pet = await Pet.findById(req.body.petId);
  if (!pet) throw new HttpError(404, 'Pet not found');
  if (pet.status !== 'available') throw new HttpError(400, 'This pet is no longer available');

  const app = await Application.create({
    pet: pet._id,
    adopter: req.user._id,
    message: req.body.message,
  });
  res.status(201).json({ application: app });
};

// Adopter: only MY applications
exports.mine = async (req, res) => {
  const applications = await Application.find({ adopter: req.user._id })
    .populate('pet', 'name species photo status')
    .sort('-createdAt');
  res.json({ applications });
};

// Shelter: applications for pets that THEY own
exports.forShelter = async (req, res) => {
  const myPetIds = await Pet.find({ shelter: req.user._id }).distinct('_id');
  const applications = await Application.find({ pet: { $in: myPetIds } })
    .populate('pet', 'name species photo status')
    .populate('adopter', 'name email')
    .sort('-createdAt');
  res.json({ applications });
};

// Shelter (owner of the pet) or admin: approve / reject
exports.setStatus = async (req, res) => {
  const app = await Application.findById(req.params.id);
  if (!app) throw new HttpError(404, 'Application not found');

  const pet = await Pet.findById(app.pet);
  if (!pet) throw new HttpError(404, 'Pet not found');

  if (!pet.shelter.equals(req.user._id) && req.user.role !== 'admin') {
    throw new HttpError(403, 'You can only review applications for your own pets');
  }
  if (app.status !== 'pending') throw new HttpError(400, 'This application was already reviewed');

  app.status = req.body.status;
  await app.save();

  if (app.status === 'approved') {
    pet.status = 'adopted';
    await pet.save();
    // reject every other pending application for the same pet
    await Application.updateMany(
      { pet: pet._id, _id: { $ne: app._id }, status: 'pending' },
      { status: 'rejected' }
    );
  }
  res.json({ application: app });
};

// Adopter: withdraw own pending application
exports.withdraw = async (req, res) => {
  const app = await Application.findById(req.params.id);
  if (!app) throw new HttpError(404, 'Application not found');
  if (!app.adopter.equals(req.user._id)) throw new HttpError(403, 'This is not your application');
  if (app.status !== 'pending') throw new HttpError(400, 'Only pending applications can be withdrawn');
  await app.deleteOne();
  res.json({ message: 'Application withdrawn' });
};
