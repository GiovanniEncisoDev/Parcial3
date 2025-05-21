// ========================= Importar dependencias =========================
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { Pool } = require('pg');

// ========================= Configuración =========================
const APP_PORT = process.env.PORT || 3000;
const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  ssl: {
    rejectUnauthorized: false // Necesario para Supabase
  }
});

// ========================= Crear instancia de Express =========================
const app = express();

// ========================= Middlewares =========================
app.use(express.json());
app.use(morgan('combined'));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// ========================= Rutas =========================

// Obtener películas
app.get('/peliculas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM peliculas ORDER BY idPelicula');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al conectar con la base de datos:', err);
    res.status(500).json({ error: 'Error en el servidor o base de datos' });
  }
});

// Enviar nueva película
app.post('/peliculas', async (req, res) => {
  const { titulo, director, genero, anio, imagen, url } = req.body;
  try {
    const query = `
      INSERT INTO peliculas (titulo, director, genero, anio, imagen, url)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    await pool.query(query, [titulo, director, genero, anio, imagen, url]);
    res.status(201).json({ mensaje: 'Película agregada exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al agregar la película' });
  }
});

// Modificar una película
app.patch('/peliculas/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, director, genero, anio } = req.body;
  try {
    const query = `
      UPDATE peliculas
      SET titulo = $1, director = $2, genero = $3, anio = $4
      WHERE idPelicula = $5
    `;
    await pool.query(query, [titulo, director, genero, anio, id]);
    res.json({ mensaje: 'Película actualizada exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar la película' });
  }
});

// Eliminar una película por ID
app.delete('/peliculas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM peliculas WHERE idPelicula = $1', [id]);
    res.json({ mensaje: 'Película eliminada exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar la película' });
  }
});

// ========================= Middleware para rutas no encontradas =========================
app.use((req, res) => {
  res.status(404).send('Ruta no encontrada');
});

// ========================= Iniciar el servidor =========================
app.listen(APP_PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${APP_PORT}`);
});
