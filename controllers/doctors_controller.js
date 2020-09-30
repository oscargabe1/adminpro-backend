const { response } = require('express');
const Doctor = require('../models/doctor');

const getDoctors = async (req, res = response) =>{

    const doctors = await Doctor.find()
                                .populate('user','name img')
                                .populate('hospital','name')

    res.json({
        ok:true,
        doctors
    })
}

const addDoctor = async (req, res = response) =>{

    const uid = req.uid;
    const doctor = new Doctor({
        user: uid,
        ...req.body
    });

    try {

        const doctorDB = await doctor.save();

        res.json({
            ok:true,
            doctor: doctorDB
        })
        
    } catch (error) {

        res.status(500).json({
            ok:false,
            msg: "Error al crear doctor"
        })
        
    }

   
}
    
const editDoctor = (req, res = response) =>{
    res.json({
        ok:true,
        msg: "Editar Doctors"
    })
}

const deleteDoctor = (req, res = response) =>{
    res.json({
        ok:true,
        msg: "Delete Doctors"
    })
}




module.exports = {
    getDoctors,
    addDoctor,
    editDoctor,
    deleteDoctor
}