// Rutas
var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// MiddreWare
app.use(fileUpload())

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;
    var listaTipos = ['usuarios', 'hospitales', 'medicos'];

    if (listaTipos.indexOf(tipo) < 0) {
        res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no es valida',
            errors: { message: 'Tipo de coleccion no es valida' }
        });
    }


    if (!req.files) {

        return res.status(500).json({
            ok: false,
            mensaje: 'No selecciono ningun archivo',
            errors: { message: 'Debe serleccionar un archivo' }
        });

    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extencionArchivo = nombreCortado[nombreCortado.length - 1];

    // Solo estas extenciones aceptamos
    var extencionesValidas = ['png', 'jpg', 'gif', 'jepg'];
    if (extencionesValidas.indexOf(extencionArchivo) < 0) {

        res.status(400).json({
            ok: false,
            mensaje: 'Extensión no Valida',
            errors: { message: 'Las extenciones validas son' + extencionesValidas.join(', ') }
        });
    }

    // Crear el nombre del archivo personalizado
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds()}.${ extencionArchivo}`;

    // Mover del Temporal a un path
    var path = `./uploads/${tipo}/${ nombreArchivo}`;

    archivo.mv(path, err => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }
    });


    //

    subirPorTipo(tipo, id, nombreArchivo, res);
    /*     res.status(200).json({
            ok: true,
            mensaje: 'Archivos Movidos',
            path: path
        }); */

});

function subirPorTipo(tipo, id, nombreArchivo, res) {
    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            if (usuario === null) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe usuario',
                    errors: { message: 'No existe usuario con id ' + id }
                });
            }
            var pathViejo = './uploads/usuarios/' + usuario.img;
            // Si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }
            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'Error al guardar imagen Usuario',
                        errors: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen Usuario Actualizada',
                    usuario: usuarioActualizado
                });

            });
        });
    }

    if (tipo === 'medicos') {
        Medico.findById(id, (err, medico) => {
            if (medico === null) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe Medico',
                    errors: { message: 'No existe Medico con id ' + id }
                });
            }

            var pathViejo = './uploads/medicos/' + medico.img;
            // Si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }
            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {
                medicoActualizado.password = ':(';
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'Error al guardar imagen de Medico',
                        errors: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen Medico Actualizada',
                    medico: medicoActualizado
                });

            });
        });

    }

    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {

            if (hospital === null) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe Hospital',
                    errors: { message: 'No existe hospital con id ' + id }
                });
            }

            var pathViejo = './uploads/hospitales/' + hospital.img;
            // Si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }
            hospital.img = nombreArchivo;
            hospital.save((error, hospitalActualizado) => {
                if (error) {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'Error al guardar imagen del Hospital',
                        errors: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Hospital Medico Actualizada',
                    hospital: hospitalActualizado
                });

            });
        });

    }
}

module.exports = app;