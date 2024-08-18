const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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
    var user = this;

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
    }
    
})
const User = mongoose.model('User', userSchema);

module.exports = { User }