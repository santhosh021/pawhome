const mongoose = require('mongoose');
const uniqueValidatorModule = require('mongoose-unique-validator');
const uniqueValidator = uniqueValidatorModule.default || uniqueValidatorModule; // v6 exports { default }

const applicationSchema = new mongoose.Schema(
  {
    pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
    adopter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, trim: true, maxlength: 500 },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

// One application per adopter per pet (checked in the controller)
applicationSchema.index({ pet: 1, adopter: 1 }, { unique: true });
applicationSchema.plugin(uniqueValidator, { message: 'You have already applied for this pet' });

module.exports = mongoose.model('Application', applicationSchema);
