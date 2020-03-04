// Requires
    var express = require('express');
    var mongosse = require('mongoose');
    var bodyParser = require('body-parser');

// Inicar variables
    var app = express();
//Cors
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods",  "POST, GET, DELETE, PUT, OPTIONS");
        next();
      });

// Body parser
// parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
// importar Rutas
    var appRputes = require('./routes/app');
    var usuarioRoutes = require('./routes/usuario');
    var loginRoutes = require('./routes/login');
    var hospitalRoutes = require('./routes/hospital');
    var medicoRoutes = require('./routes/medico');
    var busquedaRoutes = require('./routes/busqueda');
    var upladoRoutes = require('./routes/upload');
    var imagenesRoutes = require('./routes/imagenes');

// Conexion base de datos
    mongosse.connection.openUri('mongodb://localhost:27017/hospitalDB',(err,res) => {
        if ( err ) throw err;
        console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
    });

//Server index config
    // var serveIndex = require('serve-index');
    // app.use(express.static(__dirname + '/'))
    // app.use('/uploads', serveIndex(__dirname + '/uploads'));
// Rutas
    app.use('/usuario',usuarioRoutes);
    app.use('/login',loginRoutes);
    app.use('/hospital',hospitalRoutes);
    app.use('/medico',medicoRoutes);
    app.use('/busqueda',busquedaRoutes);
    app.use('/upload',upladoRoutes);
    app.use('/img',imagenesRoutes);
    app.use('/',appRputes);



// Escuchar peticiones
    app.listen(3000,()=>{
        console.log('Exprees on port 3000: \x1b[32m%s\x1b[0m', 'online');
        
    });