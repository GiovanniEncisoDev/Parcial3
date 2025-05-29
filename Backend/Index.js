const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public')); // Para servir index.html, main.js, style.css

// Configura tu conexión a MySQL (ajusta usuario, contraseña y base de datos)
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',        // Usuario MySQL (normalmente root en WAMP)
  password: '',        // Contraseña (vacía por defecto en WAMP)
  database: 'peliculasdb',  // Cambia por el nombre de tu base de datos
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Obtener todas las películas
app.get('/peliculas', (req, res) => {
  pool.query('SELECT * FROM peliculas', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Agregar una película
app.post('/peliculas', (req, res) => {
  const { titulo, director, genero, anio, imagen, url } = req.body;
  pool.query(
    'INSERT INTO peliculas (titulo, director, genero, anio, imagen, url) VALUES (?, ?, ?, ?, ?, ?)',
    [titulo, director, genero, anio, imagen, url],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ idPelicula: results.insertId, ...req.body });
    }
  );
});

// Modificar una película
app.put('/peliculas/:id', (req, res) => {
  const id = req.params.id;
  const { titulo, director, genero, anio, imagen, url } = req.body;
  pool.query(
    'UPDATE peliculas SET titulo = ?, director = ?, genero = ?, anio = ?, imagen = ?, url = ? WHERE idPelicula = ?',
    [titulo, director, genero, anio, imagen, url, id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.affectedRows === 0) return res.status(404).json({ error: 'Película no encontrada' });
      res.json({ idPelicula: id, ...req.body });
    }
  );
});

// Eliminar una película
app.delete('/peliculas/:id', (req, res) => {
  const id = req.params.id;
  pool.query(
    'DELETE FROM peliculas WHERE idPelicula = ?',
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.affectedRows === 0) return res.status(404).json({ error: 'Película no encontrada' });
      res.json({ mensaje: 'Película eliminada' });
    }
  );
});

app.listen(port, () => {
  console.log(`Servidor ejecutándose en el puerto ${port}`);
});
