const { User } = require("../models/User");

// 클라이언트로부터 받아온 토큰을 decode 시켜서 인증 처리하는 곳
let auth = (req, res, next) => {
  // 클라이언트 쿠키에서 토큰을 가져온다.
  let token = req.cookies.x_auth;
  // 토큰을 복호화 한 후 유저를 찾는다.
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });
    // 유저가 있으면 인증 성공
    req.token = token;
    req.user = user;
    next(); // 미들웨어에서 다음으로 넘어가는 것
  });
  // 유저가 있으면 인증 Okay
  // 유저가 없으면 인증 No
};

module.exports = { auth };