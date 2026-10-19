const Pet = require('../models/Pet');
const Application = require('../models/Application');
const HttpError = require('../utils/HttpError');
const { removeFile } = require('../config/upload');

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Public: list pets with optional filters
exports.list = async (req, res) => {
  const { species, status, search } = req.query;
  const filter = {};
  if (species) filter.species = species;
  if (status) filter.status = status;
  if (search) {
    const rx = new RegExp(escapeRegex(String(search)), 'i');
    filter.$or = [{ name: rx }, { breed: rx }];
  }
  const pets = await Pet.find(filter).populate('shelter', 'shelterName name').sort('-createdAt');
  res.json({ pets });
};

// Public: single pet
exports.get = async (req, res) => {
  const pet = await Pet.findById(req.params.id).populate('shelter', 'shelterName name');
  if (!pet) throw new HttpError(404, 'Pet not found');
  res.json({ pet });
};

// Shelter: only their own pets
exports.mine = async (req, res) => {
  const pets = await Pet.find({ shelter: req.user._id }).sort('-createdAt');
  res.json({ pets });
};

exports.create = async (req, res) => {
  const { name, species, breed, age, gender, description } = req.body;
  const pet = await Pet.create({
    name,
    species,
    breed,
    age,
    gender,
    description,
    photo: req.file ? req.file.filename : undefined,
    shelter: req.user._id, // owner is always the logged-in user, never taken from the body
  });
  res.status(201).json({ pet });
};

// AUTHORIZATION (ownership): only the shelter that created the pet, or an admin
async function loadOwnedPet(req) {
  const pet = await Pet.findById(req.params.id);
  if (!pet) throw new HttpError(404, 'Pet not found');
  const isOwner = pet.shelter.equals(req.user._id);
  if (!isOwner && req.user.role !== 'admin') {
    throw new HttpError(403, 'You can only manage pets that your shelter added');
  }
  return pet;
}

exports.update = async (req, res) => {
  const pet = await loadOwnedPet(req);
  ['name', 'species', 'breed', 'age', 'gender', 'description'].forEach((f) => {
    if (req.body[f] !== undefined) pet[f] = req.body[f];
  });
  if (req.body.status && ['available', 'adopted'].includes(req.body.status)) pet.status = req.body.status;
  if (req.file) {
    removeFile(pet.photo); // replace the old photo
    pet.photo = req.file.filename;
  }
  await pet.save();
  res.json({ pet });
};

exports.remove = async (req, res) => {
  const pet = await loadOwnedPet(req);
  removeFile(pet.photo);
  await Application.deleteMany({ pet: pet._id });
  await pet.deleteOne();
  res.json({ message: 'Pet deleted' });
};
