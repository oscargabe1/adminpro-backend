//Ruta: /api/hospitals/:keyword
const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate_fields');
const { validateJWT } = require('../middlewares/validate_jwt');

const {getSearch, collectionSearch} = require('../controllers/search_controller');

const router = Router();

router.get('/:keyword', validateJWT, getSearch);
router.get('/collection/:table/:keyword', validateJWT, collectionSearch);

module.exports = router;