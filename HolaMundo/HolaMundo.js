const express =require('express')
const app=express();
app.get('/', (req, res) => {
res.send('servidor express econtrado')
})
app.listen(8082, () => {
console.lo('servidor express escuchando en el puerto 8081')
})