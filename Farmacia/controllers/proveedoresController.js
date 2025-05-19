const db = require('../db/conexion');

exports.obtenerTodos = (req, res) => {
    db.query('SELECT * FROM Proveedores', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.agregar = (req, res) => {
    const { nombre, direccion, telefono, email } = req.body;
    db.query(
        'INSERT INTO Proveedores (nombre, direccion, telefono, email) VALUES (?, ?, ?, ?)',
        [nombre, direccion, telefono, email],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: 'Proveedor agregado', id: result.insertId });
        }
    );
};
