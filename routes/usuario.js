var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var miAuteitacion = require('../middlewares/autenticacion');
var app = express();
var Usuario = require('../models/usuario');
// ==================================================
// Obtener usuarios
// ==================================================
app.get('/', (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);
  Usuario.find({}, 'nombre email img role')
    .skip(desde)
    .limit(5)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Erro cargando usuario',
          errors: err
        });
      }
      Usuario.count({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          usuarios: usuarios,
          Total: conteo
        });
      });
    });
});

// ==================================================
// Actullizar usuarios
// ==================================================
app.put('/:id', miAuteitacion.verificaToken, (req, res) => {
  var id = req.params.id;
  var body = req.body;

  Usuario.findById(id, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar usuario',
        errors: err
      });
    }

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El usuario con el' + id + 'no exite',
        errors: { message: 'No existe un usuario con ese ID' }
      });
    }

    (usuario.nombre = body.nombre),
      (usuario.email = body.email),
      (usuario.role = body.role),
      usuario.save((err, usuarioGuradado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            mensaje: 'Error al actulizar usuario',
            errors: err
          });
        }
        usuarioGuradado.password = ':)';
        res.status(200).json({
          ok: true,
          usuario: usuarioGuradado
        });
      });
  });

  // res.status(200).json({
  //     ok: true,
  //     id: id
  // });
});
// ==================================================
// Agregar usuarios
// ==================================================
app.post('/',  (req, res) => {
  var body = req.body;
  var usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    img: body.img,
    role: body.role
  });
  usuario.save((err, usuarioGuradado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al crear usuario',
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      usuario: usuarioGuradado
    });
  });
});
// ==================================================
// Borrar usuarios
// ==================================================

app.delete('/:id', (req, res) => {
  var id = req.params.id;
  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al borrar usuario',
        errors: err
      });
    }

    if (!usuarioBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: 'No existe usuario con ese ID',
        errors: { message: 'No existe usuario con ese ID' }
      });
    }

    res.status(200).json({
      ok: true,
      usuarios: usuarioBorrado
    });
  });
});
module.exports = app;
