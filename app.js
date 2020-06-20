// Requires: Importación de librerias
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
// Inicializar variables
var app = express();

// BODY PARSER
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Conexion a la base de datos
const db = mongoose.connection;
mongoose.connect('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true });
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('BASE DE DATOS:\x1b[32m%s\x1b[0m', 'online');
});

//IMPORTAR RUTAS
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

// RUTAS
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);



// Escuchar peticiones
app.listen(3001, () => {
    console.log('Express server puerto 3001:\x1b[32m%s\x1b[0m', 'online');
});