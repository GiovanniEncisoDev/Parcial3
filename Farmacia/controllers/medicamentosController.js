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
