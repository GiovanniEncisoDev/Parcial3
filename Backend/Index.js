const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Asegúrate que tu frontend esté aquí

// Lista dinámica de películas (vacía al inicio)
let peliculas = [];

// Obtener todas las películas
app.get('/peliculas', (req, res) => {
  res.json(peliculas);
});

// Agregar nueva película
app.post('/peliculas', (req, res) => {
  const nueva = req.body;
  nueva.idPelicula = peliculas.length ? Math.max(...peliculas.map(p => p.idPelicula)) + 1 : 1;
  peliculas.push(nueva);
  res.status(201).json(nueva);
});

// Eliminar película
app.delete('/peliculas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = peliculas.findIndex(p => p.idPelicula === id);
  if (index !== -1) {
    peliculas.splice(index, 1);
    res.sendStatus(204);
  } else {
    res.status(404).send('Película no encontrada');
  }
});

// Modificar película
app.put('/peliculas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = peliculas.findIndex(p => p.idPelicula === id);
  if (index !== -1) {
    peliculas[index] = { idPelicula: id, ...req.body };
    res.json(peliculas[index]);
  } else {
    res.status(404).send('Película no encontrada');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
