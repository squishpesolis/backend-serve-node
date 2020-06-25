// Rutas
var express = require('express');

var app = express();

// MODELOS
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');
const usuario = require('../models/usuario');

// ========================================
// BUSQUEDA POR COLECCION
//========================================


app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');
    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuario(busqueda, regex);
            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;
        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;
        default:
            res.status(400).json({
                ok: false,
                mensaje: 'No se encontro la busqueda ' + tabla,
                error: { message: ' Tipo de tabla/ coleccion: ' + tabla + 'no valido' }
            });
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });
});

// ========================================
// BUSQUEDA GENERAL
//========================================


app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all(
            [buscarHospitales(busqueda, regex),
                buscarMedicos(busqueda, regex),
                buscarUsuario(busqueda, regex)
            ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2],
            });
        });

});

function buscarHospitales(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {

                if (err) {
                    reject('Erro al cargar Hospitales', err);
                } else {
                    resolve(hospitales);
                }
            });
    });
}

function buscarMedicos(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex }, (err, medicos) => {
            if (err) {
                reject('Erro al cargar Medicos', err);
            } else {
                resolve(medicos);
            }
        });
    });
}

function buscarUsuario(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuario) => {
                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuario);
                }
            });
    });
}

module.exports = app;