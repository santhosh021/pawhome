const router = require('express').Router();
const c = require('../controllers/authController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { registerRules, loginRules } = require('../middleware/validators');

router.post('/register', registerRules, validate, c.register);
router.post('/login', loginRules, validate, c.login);
router.get('/me', auth, c.me);

module.exports = router;
