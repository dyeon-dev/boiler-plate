const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const { User } = require("./models/User");

// url 파싱해서 데이터 가져오기
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
 
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://kdy37912:1234@boiler-plate.d0suo.mongodb.net/?retryWrites=true&w=majority&appName=boiler-plate').then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err))

app.get('/', (req, res)=>res.send('Hello World'))

// 회원가입할 때 필요한 정보들을 client에서 가져오면 DB에 넣어준다.
app.post('/register', async (req, res) => {
    const user = new User(req.body)

    try {
        const userInfo = await user.save()
        return res.status(200).json({
            success: true,
            userInfo
        })
    } catch (err) {
        return res.status(400).json({ success: false, err })
    }
})
app.listen(port, () => console.log(`Example ${port}`))
