const db = require('../db/conexion');

exports.obtenerTodos = (req, res) => {
    db.query('SELECT id_usuario, nombre, apellido, email FROM Usuarios', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.agregar = (req, res) => {
    const { nombre, apellido, email, password } = req.body;
    db.query(
        'INSERT INTO Usuarios (nombre, apellido, email, password) VALUES (?, ?, ?, ?)',
        [nombre, apellido, email, password],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: 'Usuario registrado', id: result.insertId });
        }
    );
};
