const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://kdy37912:1234@boiler-plate.d0suo.mongodb.net/?retryWrites=true&w=majority&appName=boiler-plate').then(()=>console.log("connected"))
.catch(err=>console.log(err))
app.get('/', (req, res)=>res.send('Hello World'))

app.listen(port, () => console.log(`Example ${port}`))
