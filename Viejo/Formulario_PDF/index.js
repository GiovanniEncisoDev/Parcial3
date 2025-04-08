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
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
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

app.post('/formulario', upload.single('archivo'), (req, res) => {
    try {
        console.log('Datos del formulario:', req.body);
        console.log('Archivo subido:', req.file);
        
        const pdfPath = path.join(pdfFolder, 'a4.pdf');
        const doc = new jsPDF();
        doc.text(`Hola ${req.body.nombres}, gracias por enviar tu archivo.`, 10, 10);

        // Si el archivo es una imagen, agregarla al PDF
        if (req.file && req.file.mimetype.startsWith('image')) {
            const imagePath = path.join(uploadFolder, req.file.filename);

            // Leer la imagen como base64
            const imageData = fs.readFileSync(imagePath, { encoding: 'base64' });
            const imageFormat = req.file.mimetype.split('/')[1]; // Obtener el formato (jpeg, png, etc.)

            // Agregar la imagen al PDF
            doc.addImage(imageData, imageFormat.toUpperCase(), 10, 20, 180, 160); // Ajustar posición y tamaño
        }

        // Guardar el PDF
        doc.save(pdfPath);

        // Enviar el PDF como respuesta al cliente
        res.sendFile(pdfPath);
    } catch (error) {
        console.error('Error al procesar la solicitud:', error.message);
        res.status(500).send('Ocurrió un error al procesar tu solicitud.');
    }
});

app.listen(8080, () => {
    console.log('Servidor Express escuchando en puerto 8080');
});
