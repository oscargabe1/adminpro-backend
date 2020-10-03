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
    
const editHospital = async (req, res = response) =>{
    
    const hospitalId = req.params.id;
    const uid = req.uid;
    try {

        const hospital = await Hospital.findById(hospitalId);
        if(!hospital){
            return res.status(400).json({
                ok:false,
                msg: "No se encontro un hospital con ese ID"
            });
        }

        const hospitalChanges = {
            ...req.body,
            user: uid
        }

        const updatedHospital = await Hospital.findByIdAndUpdate(hospitalId, hospitalChanges, {new:true});

        
        res.json({
            ok:true,
            msg: "Hospital actualizado",
            hospital: updatedHospital
        })
    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"Error al editar hospital"
        })
        
    }
}

const deleteHospital = async (req, res = response) =>{

    
    
    try {
        const hospitalId = req.params.id;

        const hospital = await Hospital.findById(hospitalId);
        if(!hospital){
            return res.status(400).json({
                ok:false,
                msg: "No se encontro un hospital con ese ID"
            });
        }

        await Hospital.findByIdAndDelete(hospitalId);

        res.json({
            ok:true,
            msg:'Hospital eliminado'
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:true,
            msg:"Error al eliminar hospital"
        })
        
    }
}




module.exports = {
    getHospitals,
    addHospital,
    editHospital,
    deleteHospital
}