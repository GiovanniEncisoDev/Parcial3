const express = require('express');

const app = express();

app.get('/usuarioALL', (req, res) => {
    Connection.query(
        
    )
})


app.get('/', (req, res) => {
    res.send('¡Hola Mundo!');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
