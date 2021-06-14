const User              = require("../models/user.model");
const bcrypt            = require("bcryptjs");
const jwt               = require("jsonwebtoken");

module.exports.addUser = async (req, res) =>{
    try{
        const {
            username, 
            firstname,
            lastname,
            password, 
            passwordVerify
        } = req.body;

        if (!username || !password || !passwordVerify || !firstname || !lastname) 
            return res.status(400).json({errorMessage: "please enter all required fields."});
        if (password.length < 6 ) return res.status(400).json({errorMessage: "please enter a password of at least 6 characters."});
        if (password !== passwordVerify) return res.status(400).json({errorMessage: "please enter the same password twice."});
        const existingUser = await User.findOne({username});
        if(existingUser) return res.status(400).json({errorMessage: "An account with this email already exists."});
        // hash the password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        // save the new user to the DB
        const newUser = new User({username, passwordHash, firstname, lastname});
        const savedUser = await newUser.save();
        // sign the token
        const token = jwt.sign({id: savedUser._id, firstname, lastname, userImage: savedUser.userImage},process.env.JWT_SECRET);
        // send the token in a HTTP-Only cookie
        res.cookie("token", token, {
            httpOnly: true,
        });
        res.json({id: savedUser._id}).send();
    } catch(err) {
        console.error(err);
        res.status(500).send();
    }
}

module.exports.logUser = async (req, res) =>{
    try {
        const {username, password} = req.body;
        if (!username || !password ) return res.status(400).json({errorMessage: "please enter all required fields."});
        const existingUser = await User.findOne({username});
        if(!existingUser) return res.status(401).json({errorMessage: "wrong email or password."});
        const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
        if (!passwordCorrect) return res.status(401).json({errorMessage: "wrong email or password."});
        // sign the token
        const token = jwt.sign({
            id: existingUser._id,
            firstname: existingUser.firstname, 
            lastname: existingUser.lastname,
            userImage: existingUser.userImage
        },process.env.JWT_SECRET);
        // send the token in a HTTP-Only cookie
        res.cookie("token", token, {
            httpOnly: true,
        }).send();
    } catch(err) {
        console.error(err);
        res.status(500).send();
    }
}

module.exports.logoutUser = (req, res) =>{
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0)
    }).send();
}

module.exports.isLoggedIn = (req, res)=>{
    try {
        const token = req.cookies.token;
        if (!token) return res.json({
            success: false
        });
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        res.json({
            success: true,
            userInfo : verified
        });
    } catch(err) {
        res.json({
            success: false
        });
    }
}