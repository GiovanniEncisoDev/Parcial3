const express = require('express');
const app = express();

app.use(express.json());
app.use(express.text());

app.get('/administrativos', (req, res) => {
    console.log('Query params:', req.query);
    res.send('Servidor Express contestando petición GET en /administrativos');
});

app.get('/estudiantes/:carrera', (req, res) => {
    console.log('Parámetro de ruta - carrera:', req.params.carrera);
    console.log('Parámetro de consulta - control:', req.query.control);
    res.send('Servidor Express contestando petición GET en /estudiantes/:carrera');
});

app.get('/maestros', (req, res) => {
    console.log('Body params:', req.body);
    res.send('Servidor Express contestando petición POST en /maestros');
});

app.listen(8080, () => {
    console.log('Servidor Express escuchando en puerto 8080');
});

//--------------------------------------------------------------------------------------------
/*app.use((req, res, next) => {
    res.send()
    next();
}) //funcion midel

app.use((req, res, next) => {next();},
        (req, res, next)=> next(),
        (req, res, next)=> next()
);

app.use(express.json()); //json body
app.use(express.text()); //
app.get{
    console.log(req.query)
}*/

/*http://localhost:8080/empleado?=2
query parameter
id 2

body
{
id=2
}

/estudiantes/sistemas/?control
query parameters
control 9310095

console.log(req,body/query/params)
*/