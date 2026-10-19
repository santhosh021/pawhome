const router = require('express').Router();
const c = require('../controllers/petController');
const auth = require('../middleware/auth');
const { authorizeRoles, requireApprovedShelter } = require('../middleware/authorizeRoles');
const validate = require('../middleware/validate');
const { upload } = require('../config/upload');
const { petRules, mongoId } = require('../middleware/validators');

const shelterOnly = [auth, authorizeRoles('shelter', 'admin'), requireApprovedShelter];

router.get('/', c.list); // public
router.get('/mine', ...shelterOnly, c.mine); // must be above '/:id'
router.get('/:id', mongoId('id'), validate, c.get); // public

// upload.single('photo') parses multipart/form-data BEFORE validation runs
router.post('/', ...shelterOnly, upload.single('photo'), petRules, validate, c.create);
router.put('/:id', ...shelterOnly, mongoId('id'), upload.single('photo'), petRules, validate, c.update);
router.delete('/:id', ...shelterOnly, mongoId('id'), validate, c.remove);

module.exports = router;
