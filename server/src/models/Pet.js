const mongoose = require('mongoose');

const petSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    species: { type: String, enum: ['dog', 'cat', 'rabbit', 'bird', 'other'], required: true },
    breed: { type: String, trim: true },
    age: { type: Number, min: 0, max: 40, required: true }, // years
    gender: { type: String, enum: ['male', 'female'], required: true },
    description: { type: String, trim: true, maxlength: 1000 },
    photo: { type: String }, // filename saved by Multer
    status: { type: String, enum: ['available', 'adopted'], default: 'available' },
    shelter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pet', petSchema);
