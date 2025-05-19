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
