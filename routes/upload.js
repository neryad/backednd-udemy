var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// default options
app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {
  var tipo = req.params.tipo;
  var id = req.params.id;

  //tipos de colccion
  var tiposValidso = ['hospitales', 'medicos', 'usuarios'];

  if (tiposValidso.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Tipo no valido',
      errors: {
        message: 'Las colciones validas son' + ' ' + tiposValidso.join(', ')
      }
    });
  }

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      mensaje: 'No se ha selcionado archivo',
      errors: { message: 'Debe seleccionar un archivo' }
    });
  }

  // Obetner nombre del archivo

  var archivo = req.files.imagen;

  var nombreCortado = archivo.name.split('.');

  var extensinArchivo = nombreCortado[nombreCortado.length - 1];

  // Extesion aceptadas
  var extensionValidas = ['png', 'jpg', 'gif', 'jpeg'];
  if (extensionValidas.indexOf(extensinArchivo) < 0) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Extesion no valida',
      errors: {
        message:
          'Las extesiones validas son' + ' ' + extensionValidas.join(', ')
      }
    });
  }

  // Nombre archi perzalizado
  var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensinArchivo}`;

  //mover archivo
  var path = `Uploads/${tipo}/${nombreArchivo}`;
  console.log(path);

  archivo.mv(path, err => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al mover archivo',
        errors: err
      });
    }

    subirPortipo(tipo, id, nombreArchivo, res);

    // res.status(200).json({
    //   ok: true,
    //   mensaje: 'Peticion correcta'
    // });
  });
});

function subirPortipo(tipo, id, nombreArchivo, res) {
  if (tipo === 'usuarios') {
    Usuario.findById(id, (err, usuario) => {
      if (!usuario) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Usuario no existe',
          errors: err
        });
      }
      var pathviejo = './uploads/usuarios/' + usuario.img;

      if (fs.existsSync(pathviejo)) {
        fs.unlinkSync(pathviejo);
      }
      usuario.img = nombreArchivo;

      usuario.save((err, usuarioActlizado) => {
        usuarioActlizado.password = ':)';
        return res.status(200).json({
          ok: true,
          mensaje: 'Imagen actluzadio de usuario'
        });
      });
    });
  }

  if (tipo === 'medicos') {
    Medico.findById(id, (err, medico) => {
      if (!medico) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Medico no existe',
          errors: err
        });
      }
      var pathviejo = './uploads/medicos/' + medico.img;

      if (fs.existsSync(pathviejo)) {
        fs.unlinkSync(pathviejo);
      }

      medico.img = nombreArchivo;

      medico.save((err, medicoActlizado) => {
        return res.status(200).json({
          ok: true,
          mensaje: 'Imagen actluzadio de medico'
        });
      });
    });
  }
  if (tipo === 'hospitales') {
    Hospital.findById(id, (err, hopsital) => {
      if (!hopsital) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Usuario no existe',
          errors: err
        });
      }
      var pathviejo = './uploads/hospitales/' + hopsital.img;

      if (fs.existsSync(pathviejo)) {
        fs.unlinkSync(pathviejo);
      }

      hopsital.img = nombreArchivo;

      hopsital.save((err, hopsitalActlizado) => {
        return res.status(200).json({
          ok: true,
          mensaje: 'Imagen actluzadio de hopsital'
        });
      });
    });
  }
}

module.exports = app;
