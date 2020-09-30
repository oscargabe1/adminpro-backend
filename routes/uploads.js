//Ruta: /api/uploads
const { Router } = require('express');
const expressFileUpload = require('express-fileupload');

const { validateJWT } = require('../middlewares/validate_jwt');
const {uploadFile, returnFile} = require('../controllers/uploads_controller');

const router = Router();

router.use(expressFileUpload());

router.put('/:type/:id', validateJWT, uploadFile);
router.get('/:type/:file', returnFile);


module.exports = router;