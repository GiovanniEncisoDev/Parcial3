const express = require('express');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const { jsPDF } = require("jspdf");

const app = express();
const folder = path.join(__dirname, 'archivosrec/');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder); 
        }
        cb(null, folder); 
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post('/formulario', upload.single('archivo'), (req, res) => {
    console.log('Datos del formulario:', req.body);
    console.log('Archivo subido:', req.file);

    res.send(`Hola ${req.body.nombres}, tu archivo ha sido recibido correctamente.`);
});

const doc = new jsPDF();
doc.text('Hola ${req.body.nombres}', 10, 10);
doc.save(path.join(__dirname,"/archivosgen/a4.pdf"));
res.sendFile(__dirname,"/archivosgen/a4.pdf");

app.listen(8080, () => {
    console.log('Servidor Express escuchando en puerto 8080');
});

express-validator
