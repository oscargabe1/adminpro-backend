//Ruta: /api/users
const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleLogin, renewToken } = require('../controllers/auth_controller');
const { validateFields } = require('../middlewares/validate_fields');
const { validateJWT } = require('../middlewares/validate_jwt'); 

router = Router();

router.post('/',
[
    check('email', 'El email es obligatorio').isEmail(),
    check('email', 'La contraseña es obligatoria').not().isEmpty(),
    validateFields
], login);

router.post('/google',
[
    check('token', 'El token de Google es obligatorio').not().isEmpty(),
    validateFields
], googleLogin);

router.get('/renew',validateJWT, renewToken);

module.exports = router;