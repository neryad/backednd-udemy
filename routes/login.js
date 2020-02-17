var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var seed = require('../config/config').SEED; 
var app = express();
var Usuario = require('../models/usuario');

app.post('/',(req,res) => {
var body = req.body;

    Usuario.findOne({email: body.email},(err,usuarioDb) => {

        if(err){
            return res.status(500).json({
                ok: false,
                mensaje:'Error al buscar usuario',
                errors: err
            });
        }

        if(!usuarioDb){
            return res.status(400).json({
                ok: false,
                mensaje:'Credenciles incorrectas - email',
                errors: err
            });
        }

        if(!bcrypt.compareSync(body.password, usuarioDb.password)){
            return res.status(400).json({
                ok: false,
                mensaje:'Credenciles incorrectas - password',
                errors: err
            });
        }
//Crear token
usuarioDb.password = ':)';
 var token = jwt.sign({usuario: usuarioDb},seed,{expiresIn: 14400}); //4 horas
        res.status(200).json({
            ok: true,
            usuario: usuarioDb,
            token: token,
            id:usuarioDb._id
          });
    });
   
});

module.exports = app;