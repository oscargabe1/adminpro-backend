const path = require('path');
const fs = require('fs');
const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { updateImage } = require('../helpers/update_image');

const uploadFile = (req, res = response) =>{

    const type = req.params.type;
    const id = req.params.id;

    //Validar tipo
    const validTypes = ['users','doctors','hospitals'];
    if( !validTypes.includes(type)){
        return res.status(400).json({
            ok:false,
            msg: "No es un usuario, hospital o doctor"
        })
    }

    //Validar que exista el archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok:false,
            msg:"No se encontro un archivo"
        })
      }

      //Procesar la imagen
      const file = req.files.image;
      const nameSplit = file.name.split('.');
      const extension = nameSplit[nameSplit.length - 1];

      //Validar extension
      const validExtensions = ['png','jpg','jpeg','gif'];
      if( !validExtensions.includes(extension)){
        return res.status(400).json({
            ok:false,
            msg: "No es una extension permitida"
        })
    }

    //Generar el nombre del archivo
    const fileName = `${uuidv4()}.${extension}`;

    //Path para guardar la imagen
    const path = `./uploads/${type}/${fileName}`;

    //Guardar la imagen
    file.mv(path, (err) => {
        if (err){
            console.log(err);
            return res.status(500).json({
                ok:false,
                msg:"Error al guardar imagen"
            });
        }
    });

    //Actualizar BD

    updateImage(type,id,fileName);


    res.json({
        ok:true,
        ms:"Archivo subido",
        fileName
    });

}

const returnFile = (req, res) =>{

    const type = req.params.type;
    const file = req.params.file;

    const filePath = path.join(__dirname,`../uploads/${type}/${file}`);

    //Imagen default
    if(fs.existsSync(filePath)){
        res.sendFile(filePath);
    } else{
        const filePath = path.join(__dirname,`../uploads/no-img.jpg`);
        res.sendFile(filePath);
    }


}

module.exports = {
    uploadFile,
    returnFile
}