var express = require('express');
var app = express();
const path = require('path');
const fs = require('fs');

app.get('/:tipo/:img', ( req, res, next ) => { 
    var tipo = req.params.tipo;
    var img = req.params.img;
    var pathImage = path.resolve(__dirname,`../Uploads/${tipo}/${img}`);

    if(fs.existsSync(pathImage)){
        res.sendFile(pathImage);
    } else { 
        var pathNoImg = path.resolve(__dirname,'../assets/no-img.jpg');
        res.sendFile(pathNoImg);
    }

    // res.status(200).json({
    //         ok: true,
    //         mensaje:'Peticion correcta'
    // });
});

module.exports = app;