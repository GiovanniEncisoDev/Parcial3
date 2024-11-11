const express = require('express');
const path = require('path');
const app = express();

/*console.log(__dirname);
console.log(__filename); */

app.use(express.json());
app.use(express.text());

app.set('view engine', 'pug'); // establece motor de platillas 
app.set('views', path.join(__dirname, 'views')); // establece director de plantillas

app.get('/administrativos', (req, res) => {
    console.log('Query params:', req.query);
    res.render('admin'); //para regresar
});

app.get('/estudiantes/:carrera', (req, res) => {
    console.log('Parámetro de ruta - carrera:', req.params.carrera);
    console.log('Parámetro de consulta - control:', req.query.control);
    res.send('Servidor Express contestando petición GET en /estudiantes/:carrera');
});

app.post('/maestros', (req, res) => {
    console.log('Body params:', req.body);
    res.send('Servidor Express contestando petición POST en /maestros');
});

app.listen(8080, () => {
    console.log('Servidor Express escuchando en puerto 8080');
});
