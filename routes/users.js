//Ruta: /api/users
const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate_fields');
const { validateJWT } = require('../middlewares/validate_jwt');

const router = Router();
const {getUsers, addUser, editUser, deleteUser} = require('../controllers/users_controller');



router.get('/', validateJWT, getUsers);

router.post('/', 
[
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('email', 'El correo electrónico es obligatorio  ').isEmail(),
    validateFields,
], addUser);

router.put('/:id',
[
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El correo electrónico es obligatorio  ').isEmail(),
    check('role', 'El role es obligatorio').not().isEmpty(),
], editUser);

router.delete('/:id', validateJWT, deleteUser);

module.exports = router;