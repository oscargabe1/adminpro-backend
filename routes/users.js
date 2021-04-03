//Ruta: /api/users
const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate_fields');
const { validateJWT, validateAdmin, validateAdminOrSelf } = require('../middlewares/validate_jwt');

const router = Router();
const {getUsers, addUser, editUser, deleteUser} = require('../controllers/users_controller');



router.get('/', validateJWT, validateAdmin, getUsers);

router.post('/', 
[
    //validateJWT,
    //validateAdmin,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('email', 'El correo electrónico es obligatorio  ').isEmail(),
    validateFields,
], addUser);

router.put('/:id',
[
    validateJWT,
    validateAdminOrSelf,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El correo electrónico es obligatorio  ').isEmail(),
    check('role', 'El role es obligatorio').not().isEmpty(),
], editUser);

router.delete('/:id', validateJWT, validateAdmin, deleteUser);

module.exports = router;