
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateJWT = (req, res, next) =>{

    //Leer token
    const token = req.header('x-token'); 

    if(!token){
        return res.status(401).json({
            ok:false,
            msg: "No hay token en la petición"
        })
    }

    try {

        const {uid} = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = uid;  
        next(); 
        
    } catch (error) {
        return res.status(401).json({
            ok:false,
            msg:'Token no válido'
        })
        
    }
}

const validateAdmin = (req, res, next) =>{

    const uid = req.uid;

    try {
        let user = User.findById(uid);

        if (!user) {
            return res.status(404).json({
                ok:false,
                msg:'No existe el usuario'
            })
        }

        if (user.role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                ok:false,
                msg:'No cuenta con los privilegios.'
            })
        }

        next();


    } catch (error) {
        
    }

}

const validateAdminOrSelf = (req, res, next) =>{

    const uid = req.uid;
    const id = req.params.id;

    try {
        let user = User.findById(uid);

        if (!user) {
            return res.status(404).json({
                ok:false,
                msg:'No existe el usuario'
            })
        }

        if (user.role === 'ADMIN_ROLE' || uid === id) {
            next();
        } else{
            return res.status(403).json({
                ok:false,
                msg:'No cuenta con los privilegios.'
            })
        }



    } catch (error) {
        
    }

}

module.exports = {
    validateJWT,
    validateAdmin,
    validateAdminOrSelf
}