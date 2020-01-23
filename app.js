// Requires
var express = require('express');
var mongosse = require('mongoose')

// Inicar variables
var app = express();


// Conexion base de datos
    mongosse.connection.openUri('mongodb://localhost:27017/hospitalDB',(err,res) => {
        if ( err ) throw err;
        console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
    })
// Rutas
app.get('/', ( req, res, next ) => { 
res.status(200).json({
        ok: true,
        mensaje:'Peticion correcta'
    });
});

// Escuchar peticiones
app.listen(3000,()=>{
    console.log('Exprees on port 3000: \x1b[32m%s\x1b[0m', 'online');
    
});