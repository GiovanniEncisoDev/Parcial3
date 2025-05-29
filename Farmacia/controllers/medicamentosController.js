const db = require('../db/conexion');

exports.obtenerTodos = (req, res) => {
    db.query('SELECT * FROM Medicamentos', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.agregar = (req, res) => {
    const { nombre, descripcion, dosis } = req.body;
    db.query(
        'INSERT INTO Medicamentos (nombre, descripcion, dosis) VALUES (?, ?, ?)',
        [nombre, descripcion, dosis],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: 'Medicamento agregado', id: result.insertId });
        }
    );
};

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Importar rutas
const medicamentosRoutes = require('./routes/medicamentos');
const proveedoresRoutes = require('./routes/proveedores');
const inventarioRoutes = require('./routes/inventario');
const pedidosRoutes = require('./routes/pedidos');
const usuariosRoutes = require('./routes/usuarios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Carpeta pública para HTML, CSS, JS cliente

// Rutas
app.use('/api/medicamentos', medicamentosRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/usuarios', usuariosRoutes);

// Ruta principal simple
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
