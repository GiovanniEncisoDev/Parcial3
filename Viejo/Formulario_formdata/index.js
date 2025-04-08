const express =require('express');
const path = require('path');
const multer =require('multer');
const cors  = require('cors');
const app = express();

const folder = path.join(__dirname+'archivos/');
const upload = multer(dest:folder);

app.use(express.json());
app.use(express.text());
app.use(upload.single('archivo'));
app.use(cors());

app.post('formlario', (req,res)=>{
    console.log(req.body);
    res.send('Hola ${req.body.nombres}');
})

app.listen(8080, () => {
    console.log('Servidor Express escuchando en puerto 8080');
});

.catch(err => console.log("ocurrio un error"+err.message));

diskStorage
