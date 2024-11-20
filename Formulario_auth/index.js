const express = require('express');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const { jsPDF } = require("jspdf");
const { body, validationResult } = require('express-validator'); // Importar express-validator

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

// Ruta para procesar el formulario
app.post(
    '/formulario',
    upload.single('archivo'), // Middleware para manejar el archivo
    [
        // Validaciones usando express-validator
        body('nombres')
            .notEmpty().withMessage('El campo nombres es obligatorio.')
            .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres.')
            .matches(/^[a-zA-Z\s]+$/).withMessage('El nombre solo puede contener letras y espacios.'),
        body('email')
            .notEmpty().withMessage('El campo email es obligatorio.')
            .isEmail().withMessage('Debe proporcionar un correo electrónico válido.')
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            console.log('Datos del formulario:', req.body);
            console.log('Archivo subido:', req.file);
            
            const pdfPath = path.join(pdfFolder, `a4-${Date.now()}.pdf`);
            const doc = new jsPDF();
            doc.text(`Hola ${req.body.nombres}, gracias por enviar tu archivo.`, 10, 10);
            doc.save(pdfPath);

            // Enviar el PDF como respuesta al cliente
            res.sendFile(pdfPath);
        } catch (error) {
            console.error('Error al procesar la solicitud:', error.message);
            res.status(500).send('Ocurrió un error al procesar tu solicitud.');
        }
    }
);

app.listen(8080, () => {
    console.log('Servidor Express escuchando en puerto 8080');
});
