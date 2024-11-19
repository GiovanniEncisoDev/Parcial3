const express = require('express');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const { jsPDF } = require("jspdf");

const app = express();
const uploadFolder = path.join(__dirname, 'archivosrec/');
const pdfFolder = path.join(__dirname, 'archivosgen/');

// Crear las carpetas si no existen
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
}
if (!fs.existsSync(pdfFolder)) {
    fs.mkdirSync(pdfFolder);
}

// Configuración de multer para manejo de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de archivo no permitido'), false);
        }
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Endpoint para recibir datos del formulario
app.post('/formulario', upload.single('archivo'), (req, res) => {
    try {
        console.log('Datos del formulario:', req.body);
        console.log('Archivo subido:', req.file);

        // Crear un archivo PDF personalizado
        const pdfPath = path.join(pdfFolder, 'a4.pdf');
        const doc = new jsPDF();
        doc.text(`Hola ${req.body.nombres}, gracias por enviar tu archivo.`, 10, 10);
        doc.save(pdfPath);

        // Enviar el PDF como respuesta al cliente
        res.sendFile(pdfPath);
    } catch (error) {
        console.error('Error al procesar la solicitud:', error.message);
        res.status(500).send('Ocurrió un error al procesar tu solicitud.');
    }
});

// Iniciar el servidor
app.listen(8080, () => {
    console.log('Servidor Express escuchando en puerto 8080');
});
