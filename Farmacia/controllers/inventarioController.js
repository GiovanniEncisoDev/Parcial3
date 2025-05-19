const db = require('../db/conexion');

exports.obtenerTodos = (req, res) => {
    db.query('SELECT * FROM Inventario', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.agregar = (req, res) => {
    const { id_medicamento, cantidad, fecha_vencimiento, ubicacion } = req.body;
    db.query(
        'INSERT INTO Inventario (id_medicamento, cantidad, fecha_vencimiento, ubicacion) VALUES (?, ?, ?, ?)',
        [id_medicamento, cantidad, fecha_vencimiento, ubicacion],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: 'Inventario agregado', id: result.insertId });
        }
    );
};
