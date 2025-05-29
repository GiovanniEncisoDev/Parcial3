const express = require('express');
const router = express.Router();
const conexion = require('../controllers/usariosController'); // Asegúrate que este archivo exista

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM Usuarios WHERE id_usuario = ?';
  conexion.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado' });
  });
});

module.exports = router;
