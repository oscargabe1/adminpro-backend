const { response } = require('express');

const Hospital = require('../models/hospital');

const getHospitals = async (req, res = response) =>{

    const hospitals = await Hospital.find()
                                    .populate('user','name img');

    res.json({
        ok:true,
        hospitals
    })
}

const addHospital = async (req, res = response) =>{

    const uid = req.uid;
    const hospital = new Hospital({
        user: uid,
        ...req.body
    });

    console.log(uid);

    try {

        const hospitalDB = await hospital.save();

        res.json({
            ok:true,
            hospital:hospitalDB
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:true,
            msg:"Error en crear hospital"
        })
        
    }
}
    
const editHospital = (req, res = response) =>{
    res.json({
        ok:true,
        msg: "Editar Hospitales"
    })
}

const deleteHospital = (req, res = response) =>{
    res.json({
        ok:true,
        msg: "Delete Hospitales"
    })
}




module.exports = {
    getHospitals,
    addHospital,
    editHospital,
    deleteHospital
}