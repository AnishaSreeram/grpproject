const User = require("../models/user");
const {check, validationResult} = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

//--------------------------------------------------
exports.signup = (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }

    const user = new User(req.body);
    user.save((err, user) => {
        if(err){
            return res.status(400).json({
                err: "NOT ABLE TO SAVE USER DB"
            })
        }
        res.json({
            name: user.name,
            email: user.email,
            id: user._id
        });
    });
};

//----------------------------------------------------

exports.signin = (req,res) => {
    const {email, password} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }

    User.findOne({email}, (err,user) => {
        if(err || !user){
            return res.status(400).json({
                error: "USER EMAIL DOES NOT EXIST"
            })
        }

        if(!user.authenticate(password)){
            return res.status(401).json({
                error: "EMAIL AND PASSWORD DO NOT MATCH"
            })
        }
        //create token
        const token = jwt.sign({_id: user._id}, process.env.SECRET)
        //put token in cookie
        res.cookie("token", token, {expire: new Date() + 9999});

        //send response to front end
        const {_id, name, email, role} = user;
        return res.json({token, user: {_id, name, email, role} });
    });
};




//----------------------------------------------------

exports.signout = (req,res) => {
    // res.send("user signout success");
    res.clearCookie("token");
    res.json({
        message: "user signout successfully"
    });
};

//----------------------------------------------------
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    algorithms: ['HS256']
});



//custom middlewares
exports.isAuthenticated = (req,res,next) => {
    // userProperty: "auth",
    // let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    let checker = req.user._id;
    if(!checker){
        return res.status(403).json({
            error: "ACCESS DENIED"
        });
    }
    next();
};

exports.isAdmin = (req,res,next) => {
    if(req.profile.role === 0){
        return res.status(403).json({
            error: "YOU ARE NOT ADMIN"
        });
    }
    next();
};