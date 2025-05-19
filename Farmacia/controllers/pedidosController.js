const db = require('../db/conexion');

exports.obtenerTodos = (req, res) => {
    db.query('SELECT * FROM Pedidos', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.agregar = (req, res) => {
    const { id_proveedor, fecha_pedido, total } = req.body;
    db.query(
        'INSERT INTO Pedidos (id_proveedor, fecha_pedido, total) VALUES (?, ?, ?)',
        [id_proveedor, fecha_pedido, total],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: 'Pedido agregado', id: result.insertId });
        }
    );
};
