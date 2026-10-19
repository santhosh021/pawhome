const { body, param } = require('express-validator');

const mongoId = (name) => param(name).isMongoId().withMessage('Invalid id');

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Enter a valid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['adopter', 'shelter']).withMessage('Role must be adopter or shelter'),
  body('shelterName')
    .if(body('role').equals('shelter'))
    .trim()
    .notEmpty()
    .withMessage('Shelter name is required for shelters'),
];

const loginRules = [
  body('email').trim().isEmail().withMessage('Enter a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

// For multipart requests, Multer must run BEFORE these so req.body is filled
const petRules = [
  body('name').trim().notEmpty().withMessage('Pet name is required'),
  body('species').isIn(['dog', 'cat', 'rabbit', 'bird', 'other']).withMessage('Choose a valid species'),
  body('age').isFloat({ min: 0, max: 40 }).withMessage('Age must be between 0 and 40'),
  body('gender').isIn(['male', 'female']).withMessage('Choose male or female'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description is too long'),
];

const applicationRules = [
  body('petId').isMongoId().withMessage('Invalid pet id'),
  body('message').optional().isLength({ max: 500 }).withMessage('Message is too long'),
];

const statusRules = [
  body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
];

module.exports = { mongoId, registerRules, loginRules, petRules, applicationRules, statusRules };
