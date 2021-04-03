const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const {generateJWT} = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google_verify');
const { getFrontEndMenu } = require('../helpers/menu-frontend');

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
            token,
            menu: getFrontEndMenu(userDB.role)
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"Error de login"
        })
        
    }
}

const googleLogin = async(req, res = response) =>{

    const googleToken = req.body.token;
    try {

        const {name, email, picture} = await googleVerify(googleToken);

        const userDB = await User.findOne({email});
        let user;
        if(!userDB){
            user = new User({
                name,
                email,
                password: 'google',
                img: picture,
                google: true
            })
        } else{
            user = userDB;
            user.google = true;
        }

        //Guardar en BD
        await user.save();

        //Generar el TOKEN
        const token = await generateJWT(user.id);

        
        res.json({
            ok:true,
            token,
            menu: getFrontEndMenu(user.role)
        })
    } catch (error) {
        
        res.status(401).json({
            ok:false,
            msg:"Token no válido"
        })
        
    }

}

const renewToken = async (req, res = response) =>{

    const uid = req.uid;

    //Generar el TOKEN
    const token = await generateJWT(uid);

    //Obtener usuario
    const user = await User.findById(uid);

    res.json({
        ok:true,
        token,
        user,
        menu: getFrontEndMenu(user.role)
    })
}

module.exports ={
    login,
    googleLogin,
    renewToken
}