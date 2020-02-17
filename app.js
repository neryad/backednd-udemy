// Requires
var express = require('express');
var mongosse = require('mongoose');
var bodyParser = require('body-parser');

// Inicar variables
var app = express();

// Body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// importar Rutas
var appRputes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

// Conexion base de datos
    mongosse.connection.openUri('mongodb://localhost:27017/hospitalDB',(err,res) => {
        if ( err ) throw err;
        console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
    })
// Rutas
app.use('/usuario',usuarioRoutes);
app.use('/login',loginRoutes);
app.use('/',appRputes);



// Escuchar peticiones
app.listen(3000,()=>{
    console.log('Exprees on port 3000: \x1b[32m%s\x1b[0m', 'online');
    
});