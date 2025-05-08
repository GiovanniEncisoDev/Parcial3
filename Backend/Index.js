// ========================= Importar dependencias =========================
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// ========================= Crear instancia de Express =========================
const app = express();

// ========================= Middlewares =========================
app.use(express.json());         // Parsear cuerpos JSON
app.use(morgan('combined'));     // Registrar peticiones HTTP en consola
app.use(cors());                 // Habilitar CORS
app.use(express.urlencoded({ extended: true })); // Parsear cuerpos URL-encoded

// ========================= Rutas =========================

// Obtener películas
app.get('/peliculas', (req, res) => {
  console.log(req.query);       // Parámetros en la URL (query)
  console.log(req.query.id);
  res.send('Servidor express contestando!');
});

// Enviar nueva película
app.post('/peliculas', (req, res) => {
  console.log(req.body);        // Cuerpo de la solicitud POST
  res.send('Enviar');
});

// Modificar una película
app.patch('/peliculas', (req, res) => {
  res.send('Agregado');
});

// Eliminar una película por ID
app.delete('/peliculas/:id', (req, res) => {
  console.log(req.params);      // Parámetro dinámico en la URL
  res.send('Eliminado');
});

// ========================= Middleware para rutas no encontradas =========================
app.use((req, res) => {
  res.status(404).send('Ruta no encontrada');
});

// ========================= Iniciar el servidor =========================
app.listen(3000, () => {
  console.log('Servidor ejecutándose en el puerto 3000');
});
