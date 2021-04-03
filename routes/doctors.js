//Ruta: /api/doctors
const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate_fields');
const { validateJWT } = require('../middlewares/validate_jwt');

const {getDoctors, addDoctor, editDoctor, deleteDoctor, getDoctor} = require('../controllers/doctors_controller');

const router = Router();

router.get('/', validateJWT, getDoctors);

router.post('/', 
[
    validateJWT,
    check('name', 'El nombre del doctor es necesario').not().isEmpty(),
    check('hospital', 'El hospital id es necesario').isMongoId(),
    validateFields
], addDoctor);

router.put('/:id',
[
    validateJWT,
    check('name', 'El nombre del doctor es necesario').not().isEmpty(),
    check('hospital', 'El hospital id es necesario').isMongoId(),
    validateFields
], editDoctor);

router.delete('/:id', validateJWT, deleteDoctor);

router.get('/:id', validateJWT, getDoctor);

module.exports = router;