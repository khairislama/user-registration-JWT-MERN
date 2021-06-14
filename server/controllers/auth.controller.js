const User              = require("../models/user.model");
const bcrypt            = require("bcryptjs");
const jwt               = require("jsonwebtoken");
const JWT_SECRET        = process.env.JWT_SECRET || "hello there this is a secret message that you need to change"

module.exports.addUser = async (req, res) =>{
    try{
        // GETTING VARIABLES FROM FORM 
        const {
            username,
            password, 
            passwordVerify
        } = req.body;

        // ***** VERIFICATIONS *****
        // TEST IF A FIELD IS EMPTY
        if (!username || !password || !passwordVerify) 
            return res.status(400).json({success: false, errorMessage: "please enter all required fields."});

        // TEST IF PASSWORD LENGTH < 6 CARACTERS
        if (password.length < 6 ) return res.status(400).json({success: false, errorMessage: "please enter a password of at least 6 characters."});

        // TEST IF PASSWORD AND PASSWORD VERIFICATION ARE NOT THE SAME
        if (password !== passwordVerify) return res.status(400).json({success: false, errorMessage: "please enter the same password twice."});

        // VERIFY IF A USER WITH THE SAME USERNAME EXISTS
        const existingUser = await User.findOne({username});
        if(existingUser) return res.status(400).json({success: false, errorMessage: "An account with this email already exists."});

        // ***** ALL GOOD *****
        // GENERATING A SALT AND CREATING A HASHED PASSWORD
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        // SAVING THE NEW USER TO THE DB (USERNAME AND THE HASHED VERSION OF THE PASSWORD)
        const newUser = new User({username, passwordHash});
        const savedUser = await newUser.save();

        // SIGN THE TOKEN WITH SOME USER DATA THAT WE WILL NEED 
        const token = jwt.sign({id: savedUser._id, username: savedUser.username, userImage: savedUser.userImage}, JWT_SECRET);

        // SEND THE TOKEN IN A HTTP-Only COOKIE
        res.cookie("auth-token", token, {
            httpOnly: true,
        });

        // SEND BACK THE DATA
        res.json({success: true, message: "Account created successfully"}).send();
    } catch(err) {

        // IF THERE IS AN ERROR WE SEND A STATUS CODE 500 WITH AN ERROR MESSAGE
        res.status(500).send({success: false, errorMessage: "Internal server error", error: err});
    }
}

module.exports.logUser = async (req, res) =>{
    try {
        // GETTING VARIABLES FROM FORM 
        const {username, password} = req.body;

        // ***** VERIFICATIONS *****
        // TEST IF A FIELD IS EMPTY
        if (!username || !password ) return res.status(400).json({success: false, errorMessage: "please enter all required fields."});

        // TEST IF WRONG USERNAME
        const existingUser = await User.findOne({username});
        if(!existingUser) return res.status(401).json({success: false, errorMessage: "wrong email or password."});

        // TEST PASSWORD MATCH 
        const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
        if (!passwordCorrect) return res.status(401).json({success: false, errorMessage: "wrong email or password."}); // IF PASSWORD IS WRONG

        // SIGN THE TOKEN WITH SOME USER DATA THAT WE WILL NEED 
        const token = jwt.sign({
            id: existingUser._id,
            username: existingUser.username,
            userImage: existingUser.userImage
        }, JWT_SECRET);

        // SEND THE TOKEN IN A HTTP-Only COOKIE
        res.cookie("auth-token", token, {
            httpOnly: true,
        });

        // SEND BACK THE DATA
        res.json({success: true, message: `welcome back ${username}`}).send();

    } catch(err) {

        // IF THERE IS AN ERROR WE SEND A STATUS CODE 500 WITH AN ERROR MESSAGE
        res.status(500).send({success: false, errorMessage: "Internal server error", error: err});
    }
}

module.exports.logoutUser = (req, res) =>{
    // DELETING THE TOKEN
    res.cookie("auth-token", "", {
        httpOnly: true,
        expires: new Date(0)
    });

     // SEND BACK THE DATA
     res.json({success: true, message: `See you soon`}).send();
}

module.exports.isLoggedIn = (req, res)=>{
    try {
        const token = req.cookies.token;

        // IF USER IS NOT LOGGED IN
        if (!token) return res.json({success: false});

        // IF THERE IS A TOKEN, WE VERIFY IT
        const verified = jwt.verify(token, process.env.JWT_SECRET, (err)=>{
            if (err) return res.json({success: false});
        });

        // ALL CLEAR SO WE SEND OUR DATA BACK
        res.json({
            success: true,
            userInfo : verified
        });
    } catch(err) {

        // IF THERE IS AN ERROR WE SEND A STATUS CODE 500 WITH AN ERROR MESSAGE
        res.status(500).send({success: false, errorMessage: "Internal server error", error: err});
    }
}