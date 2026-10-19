const router = require('express').Router();
const c = require('../controllers/adminController');
const auth = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/authorizeRoles');
const validate = require('../middleware/validate');
const { mongoId } = require('../middleware/validators');

router.use(auth, authorizeRoles('admin')); // every admin route needs the admin role

router.get('/stats', c.stats);
router.get('/users', c.users);
router.patch('/users/:id/approve', mongoId('id'), validate, c.approve);
router.delete('/users/:id', mongoId('id'), validate, c.removeUser);

module.exports = router;
