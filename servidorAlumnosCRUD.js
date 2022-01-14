var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');

// CORS 
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
  
  
// Ruta por defecto
app.get('/', function (req, res) {
    return res.send({ error: true, message: 'Hola' })
});

// Configuración de conexión a BD
var dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'alumnosDAW2'
});
  
// Conexión a la BD
dbConn.connect(); 
 
 
//  Devuelve todos los alumnos
app.get('/alumnos', function (req, res) {
    dbConn.query('SELECT * FROM alumno', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Lista de alumnos' });
    });
});
 
 
// Devuelve un alumno 
app.get('/alumno/:id', function (req, res) {
  
    let alumno_id = req.params.id;
  
    if (!alumno_id) {
        return res.status(400).send({ error: true, message: 'Por favor, indique el id' });
    }
  
    dbConn.query('SELECT * FROM alumno where id=?', alumno_id, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'Alumno seleccionado' });
    });
  
});
 
 
// Añade un nuevo alumno 
app.post('/alumno', function (req, res) {
  
    let alumno = req.body.alumno;
    console.log(req);
    if (!alumno) {
        return res.status(400).send({ error:true, message: 'Por favor, envíe los datos de un alumno' });
     }
  
    sqlQuery = `INSERT INTO alumno VALUES(NULL,'${alumno.nombre}','${alumno.apellidos}',${alumno.nota}) `;
    dbConn.query(sqlQuery, 
     function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Nuevo alumno creado' });
    });
});
 
 
//  Modifica un alumno
app.put('/alumno', function (req, res) {
  
    let alumno_id = req.body.alumno_id;
    let alumno = req.body.alumno;
  
    if (!alumno_id || !alumno) {
        return res.status(400).send({ error: true, message: 'Debe enviar un alumno y su id' });
    }
    sqlQuery = `UPDATE alumno SET nombre = '${alumno.nombre}', apellidos = '${alumno.apellidos}', nota = ${alumno.nota} WHERE id = ?`;
        
    dbConn.query(sqlQuery, [alumno_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Alumno modificado' });
    });
});
 
 
//  Borra un alumno
app.delete('/alumno/:id', function (req, res) {
  
    let alumno_id = req.params.id;
  
    if (!alumno_id) {
        return res.status(400).send({ error: true, message: 'Por favor, indique el id' });
    }
    dbConn.query('DELETE FROM alumno WHERE id = ?', [alumno_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Alumno eliminado' });
    });
}); 
 
// Establezco puerto
app.listen(3000, function () {
    console.log('API CRUD BD alumnosAngular corriendo en puerto 3000');
});
 
module.exports = app;
