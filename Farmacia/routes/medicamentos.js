const express = require('express');
const router = express.Router();
const controller = require('../controllers/medicamentosController');

router.get('/', controller.obtenerTodos);
router.post('/', controller.agregar);
router.delete('/:id', controller.eliminar);
router.put('/:id', controller.modificar); // Para actualizar

module.exports = router;
