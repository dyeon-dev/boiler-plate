const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRound = 10;

const userSchema = mongoose.Schema({
    name: {
        type:String,
        maxlength:50
    },
    email: {
        type:String,
        trim:true,
        unique: 1 
    },
    password: {
        type: String,
        minglength: 5
    },
    lastname: {
        type:String,
        maxlength: 50
    },
    role : {
        type:Number,
        default: 0 
    },
    image: String,
    token : {
        type: String,
    },
    tokenExp :{
        type: Number
    }
})

userSchema.pre('save', function(next){
    const user = this;

    if(user.isModified('password')) {
        // 비번 암호화 시키기
        bcrypt.genSalt(saltRound, function(err, salt){
            if(err) return next(err)
                bcrypt.hash( user.password, salt, function(err, hash){
                    if(err) return next(err)
                    user.password=hash
                    next()
                })
        })
    } else {
        next()
    }
    
})

userSchema.methods.comparePassword = function(plainPassword) {
    // plainPassword 1234 , 암호화 비번: 2b$10$DW/PjQnyO/xKtUQVb0h7gu/.WnzcGIT5r8Zh44DVR0K2SDLT8teFW
    const user = this;
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainPassword, user.password, (err, isMatch) => {
            if (err) return reject(err);
            resolve(isMatch);
        });
    });
}

userSchema.methods.generateToken = async function() {
    try {
        const user = this;
        // 토큰 생성
        const token = jwt.sign(user._id.toHexString(), 'secretToken');
        user.token = token;
        await user.save();
        
        return token;
    } catch (err) {
        throw err;
    }
};

userSchema.statics.findByToken = async function(token) {
    const user = this;
    
    try {
        // 토큰을 decode 한다
        const decoded = await jwt.verify(token, 'secretToken');
        
        // 유저 아이디를 이용해 유저를 찾은 다음에 클라이언트에서 가져온 token과 DB에 보관된 token이 일치하는지 확인
        const foundUser = await user.findOne({ "_id": decoded, "token": token });
        
        return foundUser;
    } catch (err) {
        throw err;
    }
};


const User = mongoose.model('User', userSchema);

module.exports = { User }