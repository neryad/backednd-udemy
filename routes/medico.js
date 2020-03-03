var express = require('express');

var miAuteitacion = require('../middlewares/autenticacion');
var app = express();
var Medico = require('../models/medico');
// ==================================================
// Obtener medicos
// ==================================================
app.get('/', (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);
  Medico.find({})
  .skip(desde)
  .limit(5)
  .populate('usuario','nombre email')
  .populate('hospital')
  .exec((err, medicos) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error cargando medico',
        errors: err
      });
    }
    Medico.count({},(err, conteo) =>{
      res.status(200).json({
        ok: true,
        medicos: medicos,
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

  Medico.findById(id, (err, medico) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar medico',
        errors: err
      });
    }

    if (!medico) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El medico con el' + id + 'no exite',
        errors: { message: 'No existe un usuario con ese ID' }
      });
    }

    medico.nombre = body.nombre;
    medico.usuario = req.usuario._id;
    medico.hospital = body.hospital;

    medico.save((err, medicoGuradado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Error al actulizar medico',
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        medico: medicoGuradado
      });
    });
  });
});
// ==================================================
// Agregar hopital
// ==================================================
app.post('/', miAuteitacion.verificaToken, (req, res) => {
  var body = req.body;
  var medico = new Medico({
    nombre: body.nombre,
    usuario: req.usuario._id,
    hospital: body.hospital
  });
  medico.save((err, medicoGuradado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al crear hopistal',
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      medico: medicoGuradado
    });
  });
});
// ==================================================
// Borrar medico
// ==================================================

app.delete('/:id', (req, res) => {
  var id = req.params.id;
  Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al borrar usuario',
        errors: err
      });
    }

    if (!medicoBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: 'No existe medico con ese ID',
        errors: { message: 'No existe hopital con ese ID' }
      });
    }

    res.status(200).json({
      ok: true,
      medico: medicoBorrado
    });
  });
});
module.exports = app;
