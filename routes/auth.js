//Ruta: /api/users
const { Router } = require('express');
const { check } = require('express-validator');
const { login } = require('../controllers/auth_controller');
const { validateFields } = require('../middlewares/validate_fields');

router = Router();

router.post('/',
[
    check('email', 'El email es obligatorio').isEmail(),
    check('email', 'La contraseña es obligatoria').not().isEmpty(),
    validateFields
], login)

module.exports = router;