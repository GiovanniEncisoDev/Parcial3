// ========================= Importar dependencias =========================
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mysql = require('mysql2/promise');

// ========================= Crear instancia de Express =========================
const app = express();

// ========================= Middlewares =========================
app.use(express.json());                           // Parsear cuerpos JSON
app.use(morgan('combined'));                       // Registrar peticiones HTTP en consola
app.use(cors());                                   // Habilitar CORS
app.use(express.urlencoded({ extended: true }));   // Parsear cuerpos URL-encoded

// ========================= Rutas =========================

// Obtener películas
app.get('/peliculas', async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      port: 3306,
      database: 'db_20100192',
    });

    const [peliculas] = await connection.query('SELECT * FROM peliculas');

    await connection.end();

    res.json(peliculas); // Enviar las películas al cliente
  } catch (err) {
    console.error('Error al conectar con la base de datos:', err);
    res.status(500).json({ error: 'Error en el servidor o base de datos' });
  }
});

// Enviar nueva película
app.post('/peliculas', async (req, res) => {
  const { titulo, director, genero, anio } = req.body;

  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      port: 3306,
      database: 'db_20100192',
    });

    const query = 'INSERT INTO peliculas (titulo, director, genero, anio) VALUES (?, ?, ?, ?)';
    await connection.query(query, [titulo, director, genero, anio]);

    await connection.end();

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
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      port: 3306,
      database: 'db_20100192',
    });

    const query = 'UPDATE peliculas SET titulo = ?, director = ?, genero = ?, anio = ? WHERE idPelicula = ?';
    await connection.query(query, [titulo, director, genero, anio, id]);

    await connection.end();

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
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      port: 3306,
      database: 'db_20100192',
    });

    const query = 'DELETE FROM peliculas WHERE idPelicula = ?';
    await connection.query(query, [id]);

    await connection.end();

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
app.listen(3000, () => {
  console.log('Servidor ejecutándose en el puerto 3000');
});
