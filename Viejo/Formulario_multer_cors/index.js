const express = require('express');
const path = require('path');
const multer = require('multer');
const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'archivos'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); 
    }
});

const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.post('/formulario', upload.single('archivo'), (req, res) => {    
    console.log('Datos del formulario:', req.body);
    console.log('Archivo recibido:', req.file);

    if (!req.file) {
        return res.status(400).send('No se recibió ningún archivo.');
    }

    res.send(`Hola ${req.body.nombre}, archivo ${req.file.originalname} recibido exitosamente.`);
});

app.listen(8080, () => {
    console.log('Servidor Express escuchando en puerto 8080');
});

/*
if(err){
    next(err);
    return;
}

app.use((err,req,res,next)=>{

}) */