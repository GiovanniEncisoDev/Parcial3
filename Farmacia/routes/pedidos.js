const express = require('express');
const router = express.Router();
const controller = require('../controllers/pedidosController');

router.get('/', controller.obtenerTodos);
router.post('/', controller.agregar);

module.exports = router;
