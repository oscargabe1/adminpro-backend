const { response } = require('express');

const User = require('../models/user');
const Doctor = require('../models/doctor');
const Hospital = require('../models/hospital');
const { all } = require('../routes/users');


const getSearch = async (req, res = response) =>{

    const keyword = req.params.keyword;
    const regex = new RegExp(keyword, 'i');

    const [users, doctors, hospitals] = await Promise.all([
        User.find({ name: regex }),
        Doctor.find({ name: regex }),
        Hospital.find({ name: regex })
    ]);
 
    res.json({
        ok:true,
        users,
        doctors,
        hospitals
    })
}

const collectionSearch = async (req, res = response) =>{

    const table = req.params.table;
    const keyword = req.params.keyword;
    const regex = new RegExp(keyword, 'i');

    let data = [];

    switch(table){
        case 'users':
            data = await User.find({ name: regex });
            break;

        case 'doctors':
            data = await Doctor.find({ name: regex })
                                .populate('user', 'name img')
                                .populate('hospital', 'name img');
            break;

        case 'hospitals':
            data = await Hospital.find({ name: regex })
                                    .populate('user', 'name img');
            break;

        default:
            return res.status(400).json({
                ok:false,
                msg: 'La tabla no existe'
            })
            
    }

    res.json({
        ok: true,
        results: data
    });
}

module.exports = {
    getSearch,
    collectionSearch
}
