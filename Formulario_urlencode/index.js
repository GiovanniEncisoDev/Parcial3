const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended: true}));

app.post('/formulario', (req, res) => {
    console.log(req.query);
    res.send(`Hola ${req.body.nombre}`); 
});

app.listen(8080, () => {
    console.log('Servidor Express escuchando en puerto 8080');
});
