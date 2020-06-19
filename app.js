// Requires: Importación de librerias
var express = require('express');
var mongoose = require('mongoose');

// Inicializar variables
var app = express();


// Conexion a la base de datos
const db = mongoose.connection;
mongoose.connect('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true });
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('BASE DE DATOS:\x1b[32m%s\x1b[0m', 'online');
});

// Rutas
app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente OK'
    });

});

// Escuchar peticiones
app.listen(3001, () => {
    console.log('Express server puerto 3001:\x1b[32m%s\x1b[0m', 'online');
});