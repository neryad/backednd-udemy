var express = require('express');

var miAuteitacion = require('../middlewares/autenticacion');
var app = express();
var Hospital = require('../models/hospital');
// ==================================================
// Obtener hospitales
// ==================================================
app.get('/', (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);
  Hospital.find({})
  .skip(desde)
  .limit(5)
  .populate('usuario','nombre email')
  .exec((err, hospitales) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error cargando hospital',
        errors: err
      });
    }

    Hospital.count({},(err, conteo) => {
      res.status(200).json({
        ok: true,
        hospitales: hospitales,
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

  Hospital.findById(id, (err, hospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar hospital',
        errors: err
      });
    }

    if (!hospital) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El hospital con el' + id + 'no exite',
        errors: { message: 'No existe un usuario con ese ID' }
      });
    }

hospital.nombre = body.nombre;
hospital.usuario = req.usuario._id;

    hospital.save((err, hospitalGuradado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Error al actulizar hospital',
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        hospital: hospitalGuradado
      });
    });
  });
});
// ==================================================
// Agregar hopital
// ==================================================
app.post('/', miAuteitacion.verificaToken, (req, res) => {
  var body = req.body;
  var hospital = new Hospital({
    nombre: body.nombre,
    usuario: req.usuario._id
  });
  hospital.save((err, hospitalGuradado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al crear hopistal',
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      hospital: hospitalGuradado
    });
  });
});
// ==================================================
// Borrar hospital
// ==================================================

app.delete('/:id', (req, res) => {
  var id = req.params.id;
  Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al borrar usuario',
        errors: err
      });
    }

    if (!hospitalBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: 'No existe hospital con ese ID',
        errors: { message: 'No existe hopital con ese ID' }
      });
    }

    res.status(200).json({
      ok: true,
      hospital: hospitalBorrado
    });
  });
});
module.exports = app;
