const router = require('express').Router();
const c = require('../controllers/applicationController');
const auth = require('../middleware/auth');
const { authorizeRoles, requireApprovedShelter } = require('../middleware/authorizeRoles');
const validate = require('../middleware/validate');
const { applicationRules, statusRules, mongoId } = require('../middleware/validators');

router.use(auth);

router.post('/', authorizeRoles('adopter'), applicationRules, validate, c.create);
router.get('/mine', authorizeRoles('adopter'), c.mine);
router.get('/shelter', authorizeRoles('shelter'), requireApprovedShelter, c.forShelter);
router.patch(
  '/:id/status',
  authorizeRoles('shelter', 'admin'),
  requireApprovedShelter,
  mongoId('id'),
  statusRules,
  validate,
  c.setStatus
);
router.delete('/:id', authorizeRoles('adopter'), mongoId('id'), validate, c.withdraw);

module.exports = router;
