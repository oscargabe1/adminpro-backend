const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const {generateJWT} = require('../helpers/jwt');

const login = async(req, res = response) =>{

    const {email, password} = req.body;
    try {

        //Verificar email
        const userDB = await User.findOne({email});
        if(!userDB){
            return res.status(400).json({
                ok:false,
                msg:'Usuario incorrecto'
            });
        }

        //Verificar contraseña
        const validPassword = bcrypt.compareSync(password, userDB.password);
        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg:'Contraseña incorrecta'
            });
        }

        //Generar el TOKEN
        const token = await generateJWT(userDB.id);

        res.json({
            ok:true,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"Error de login"
        })
        
    }
}

module.exports ={
    login
}