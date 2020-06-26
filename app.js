// Requires: Importación de librerias
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
// Inicializar variables
var cors = require('cors');
var app = express();
app.use(cors());
// CORS
/* app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}); */

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
var hospitalesRoutes = require('./routes/hospital');
var medicosRoutes = require('./routes/medico');
var busquedasRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/img');

// RUTAS
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalesRoutes);
app.use('/medico', medicosRoutes);
app.use('/busqueda', busquedasRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/', appRoutes);



// Escuchar peticiones
app.listen(3001, () => {
    console.log('Express server puerto 3001:\x1b[32m%s\x1b[0m', 'online');
});