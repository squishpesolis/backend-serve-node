// Rutas
var express = require('express');
var mdAutentificacion = require('../middlewares/autenticacion');

var app = express();
var Medico = require('../models/medico');

// ============================================
// OBTENER MEDICOS
// ============================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .skip(desde)
        .limit(5)
        .exec(
            (err, medicos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medicos',
                        errors: err
                    });
                }

                Medico.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        medicos: medicos,
                        total: conteo
                    });
                });


            });
});

// ============================================
// CREAR UN NUEVO MEDICO    
// ============================================

app.post('/', mdAutentificacion.verificaToken, (req, res) => {
    var body = req.body;
    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            medico: medicoGuardado
        });
    });

});

// ============================================
// ACTUALIZAR MEDICO
// ============================================
app.put('/:id', mdAutentificacion.verificaToken, (req, res) => {
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
                mensaje: 'El medico con el id' + id + ' no existe',
                errors: { message: 'No existe un medico con ese Id' }
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;

        medico.hospital = body.hospital;
        console.log('A guardar');
        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el medico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado,
                usuarioToken: req.usuario
            });

        });
    });
});

// ============================================
// ELIMINAR MEDICO POR ID
// ============================================
app.delete('/:id', mdAutentificacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });

    });
});
module.exports = app;