//Ruta: /api/hospitals
const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate_fields');
const { validateJWT } = require('../middlewares/validate_jwt');

const {getHospitals, addHospital, editHospital, deleteHospital} = require('../controllers/hospitals_controller');

const router = Router();

router.get('/', getHospitals);

router.post('/', 
[
    validateJWT,
    check('name', 'El nombre del hospital es necesario').not().isEmpty(),
    validateFields
], addHospital);

router.put('/:id',
[
    validateJWT,
    check('name', 'El nombre del hospital es necesario').not().isEmpty(),
    validateFields
], editHospital);

router.delete('/:id', validateJWT, deleteHospital);

module.exports = router;