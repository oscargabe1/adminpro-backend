const {Schema, model} = require('mongoose');

const HospitalSchema = Schema({
    name:{
        type: String,
        required: true
    },
    img:{
        type: String,
    },
    user:{
        required:true,
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}
//,{collection: 'hospitales'} -> Cambiar el nombre de la tabla en BD
);

HospitalSchema.method('toJSON', function(){
    const {__v, ...object} = this.toObject();
    return object;
})

module.exports = model('Hospital', HospitalSchema);