const express = require("express"); // express를 가져온다.
const app = express(); // express를 이용해서 app을 만들어준다.
const port = 5000; // port 번호를 5000번으로 설정

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');

const config = require('./config/key')
const { auth } = require('./middleware/auth')
const { User } = require("./models/User");

// application/x-www-form-urlencoded 타입의 url 파싱해서 데이터 가져올 수 있도록 함
app.use(bodyParser.urlencoded({ extended: true }));
// application/json 타입으로 온 데이터도 분석해서 가져올 수 있도록 함
app.use(bodyParser.json());
// cookie parser 사용
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI).then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err))

  // auth 미들웨어를 통과해야 다음으로 넘어감
  app.get("/api/users/auth", auth, async (req, res) => {
    try {
        res.status(200).json({
            _id: req.user._id,
            isAdmin: req.user.role === 0 ? false : true, // 정책에 따라 바뀔 수 있음
            isAuth: true,
            email: req.user.email,
            name: req.user.name,
            lastname: req.user.lastname,
            role: req.user.role,
            image: req.user.image,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
  });

  app.post("/api/users/register", (req, res) => {
    // 회원 가입 할 때 필요한 정보들을 client에서 가져오면 그것들을 데이터베이스에 넣어준다.
    const user = new User(req.body); // body parser를 이용해서 json 형식으로 정보를 가져온다.
  
    user.save((err, userInfo) => {
      // 몽고디비에서 오는 메소드
      if (err) return res.json({ success: false, err });
      return res.status(200).json({
        // status(200)은 성공했다는 뜻
        success: true,
      });
    });
  });
  
  app.post("/api/users/login", (req, res) => {
    // 요청된 이메일을 데이터베이스에 있는지 찾는다.
    User.findOne(
      {
        email: req.body.email,
      },
      (err, user) => {
        if (!user) {
          return res.json({
            loginSuccess: false,
            message: "이메일에 해당하는 유저가 없습니다.",
          });
        }
        // 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
          if (!isMatch) {
            return res.json({
              loginSuccess: false,
              message: "비밀번호가 틀렸습니다.",
            });
          }
          // 비밀번호까지 맞다면 토큰 생성
          user.generateToken((err, user) => {
            if (err) return res.status(400).send(err);
            // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지, 세션 등등
            res
              .cookie("x_auth", user.token)
              .status(200)
              .json({ loginSuccess: true, userId: user._id });
          });
        });
      }
    );
  });
  
  
  // 로그아웃
  app.get("/api/users/logout", auth, (req, res) => {
    console.log(req.user);
    User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({ success: true });
    });
  });

app.listen(port, () => console.log(`Server running on port ${port}`))
