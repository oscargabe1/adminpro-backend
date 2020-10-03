const { response } = require('express');
const Doctor = require('../models/doctor');

const getDoctors = async (req, res = response) =>{

    const doctors = await Doctor.find()
                                .populate('user','name img')
                                .populate('hospital','name img');


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
    
const editDoctor = async (req, res = response) =>{

    try {
        const doctorId = req.params.id;
        const uid = req.uid;

        const doctor = await Doctor.findById(doctorId);
        if(!doctor){
            return res.status(400).json({
                ok:false,
                msg: "No se encontro un doctor con ese ID"
            });
        }

        const doctorChanges = {
            ...req.body,
            user:uid
        }
        const updatedDoctor = await Doctor.findByIdAndUpdate(doctorId, doctorChanges, {new:true});
        
        res.json({
            ok:true,
            msg: "Información de doctor actualizada",
            doctor: updatedDoctor
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"Error al editar doctor"
        })
        
    }
}

const deleteDoctor = async (req, res = response) =>{
    try {
        const doctorId = req.params.id;
        const doctor = await Doctor.findById(doctorId);
        if(!doctor){
            return res.status(400).json({
                ok:false,
                msg: "No se encontro un doctor con ese ID"
            });
        }
        await Doctor.findByIdAndDelete(doctorId);

        res.json({
            ok:true,
            msg:"Información de doctor eliminada"
        })

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"Error al editar doctor"
        })
        
    }
}




module.exports = {
    getDoctors,
    addDoctor,
    editDoctor,
    deleteDoctor
}