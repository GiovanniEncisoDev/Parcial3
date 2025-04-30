const express = require('express');
const app = express();

app.use(express.json()); // Middleware para parsear el cuerpo de las peticiones JSON
/*app.use(express.text()); // Middleware para parsear el cuerpo de las peticiones de texto
app.use( () => {} );
*/

app.get('/peliculas', (req, res) => {
  console.log(req.query);
  console.log(req.query.id);
  res.send('Servidor express constestando!');
});

app.post('/peliculas', (req, res) => {
  console.log(req.body);
  res.send('Enviar');
});

app.patch('/peliculas', (req, res) => {
  res.send('Agregado');
});

app.delete('/peliculas/:id', (req, res) => { 
  console.log(req.params);
  res.send('Eliminado');
});

//put-patch para agregar elementos
app.listen(3000, () => {
  console.log('Server is running on port 3000');
})