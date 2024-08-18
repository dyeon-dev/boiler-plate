const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser");

const config = require('./config/key')
const { auth } = require('./middleware/auth')
const { User } = require("./models/User");

// url 파싱해서 데이터 가져오기
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
// cookie parser 사용
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI).then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err))

app.get('/', (req, res)=>res.send('Hello World'))

// 회원가입할 때 필요한 정보들을 client에서 가져오면 DB에 넣어준다.
app.post('/api/users/register', async (req, res) => {
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

app.post('/api/users/login', async (req, res) => {
    try {
        // 요청된 이메일을 DB에 있는지 찾는다
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            });
        }
        // 요청된 이메일이 DB에 있다면 비밀번호가 맞는지 확인한다
        const isMatch = await user.comparePassword(req.body.password);
        console.log('req.body.password ', req.body.password)
        console.log('isMatch ', isMatch)
        if (!isMatch) {
            return res.json({
                loginSuccess: false,
                message: "비밀번호가 틀렸습니다."
            });
        }

        // 비밀번호까지 맞다면 토큰 생성하기
        const token = await user.generateToken();
        console.log('token ', token)
        // 쿠키에 토큰을 저장한다
        res.cookie("x_auth", token)
            .status(200)
            .json({ loginSuccess: true, userId: user._id });
    } catch (err) {
        console.log(err)
        return res.status(400).send(err);
    }
});

// role 0 -> 일반 유저  role 0이 아니면 관리자
app.get('/api/users/auth', auth, (req, res)=> {
    // 여기까지 미들웨어를 통과했다는 건 Authentication이 true라는 말
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.user._id },
            { token: "" }
        );

        if (!user) {
            return res.status(400).json({ success: false, message: err });
        }

        return res.status(200).send({
            success: true
        });
    } catch (err) {
        return res.status(500).json({ success: false, err });
    }
});

app.listen(port, () => console.log(`Example ${port}`))
