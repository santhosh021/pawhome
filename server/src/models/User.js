const mongoose = require('mongoose');
const uniqueValidatorModule = require('mongoose-unique-validator');
const uniqueValidator = uniqueValidatorModule.default || uniqueValidatorModule; // v6 exports { default }

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['adopter', 'shelter', 'admin'], default: 'adopter' },
    shelterName: { type: String, trim: true },
    // Shelters must be approved by an admin before they can add pets
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.plugin(uniqueValidator, { message: '{PATH} is already registered' });

module.exports = mongoose.model('User', userSchema);
