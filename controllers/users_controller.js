
const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const {generateJWT} = require('../helpers/jwt');

const getUsers = async (req, res) =>{

    const from = Number(req.query.from) || 0;
    console.log(from);


    const [users, userTotal] = await Promise.all([
        User.find({}, "name email role google img")
            .skip(from)
            .limit(5),
        User.countDocuments()
    ]);

    res.json({
        ok:true,
        users,
        userTotal
    });
};

const addUser = async (req, res = response) =>{

    const{email, password, name} = req.body;


    try {
        const emailExists = await User.findOne({email});

        if(emailExists){
            return res.status(400).json({
                ok:false,
                msg:"El correo ya está registrado."
            });
        }

        const user = new User(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        //Generar token
        const token = await generateJWT(user.id);
    
        await user.save();
    
        res.json({
            ok: true,
            user,
            token
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"Error de BD"
        });
        
    }

};

const editUser = async (req, res = response)=>{
    //TODO: Validar token y comprobar si es el usuario correcto

    const uid = req.params.id;
    try {

        const userDB = User.findById(uid);
        if(!userDB){
            return res.status(404).json({
                ok:false,
                msg: "No existe el usuario"
            })
        }
        
        const {password, google, email, ...fields} = req.body;

        if(userDB.email !== email){
            const emailExists = await User.findOne({email});
            if(emailExists){
                return res.status(400).json({
                    ok:false,
                    msg:"Ya existe ese correo electrónico"
                })

            }
        }
        //Actualizar
        fields.email = email;
        const updatedUser = await User.findByIdAndUpdate(uid, fields, {new: true});
        
        res.json({
            ok: true,
            updatedUser
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"Error inesperado"
        })
    }
}

const deleteUser = async (req, res = response) =>{

    const uid = req.params.id;

    try {
        const userDB = User.findById(uid);
        if(!userDB){
            return res.status(404).json({
                ok:false,
                msg: "No existe el usuario"
            })
        }
        await User.findByIdAndDelete(uid);
        
        res.json({
            ok: true,
            msg:"Usuario eliminado"
        });
    } catch (error) {
        console.log(error),
        res.status(500).json({
            ok:false,
            msg:"Error inesperado"
        })
    }

}


module.exports = {
    getUsers,
    addUser,
    editUser,
    deleteUser
}