const User              = require("../models/user.model");
const bcrypt            = require("bcryptjs");
const jwt               = require("jsonwebtoken");
const nodemailer        = require("nodemailer");
const JWT_SECRET        = process.env.JWT_SECRET || "hello there this is a secret message that you need to change"
const MAIL_USERNAME     = process.env.MAIL_USERNAME || "Put you gmail here"
const MAIL_PASSWORD     = process.env.MAIL_PASSWORD || "Put your password here"

module.exports.addUser = async (req, res) =>{
    try{
        // GETTING VARIABLES FROM FORM 
        const {
            username,
            fullname,
            password, 
            repeatPassword
        } = req.body;

        // ***** VERIFICATIONS *****
        // TEST IF A FIELD IS EMPTY
        if (!username || !password || !repeatPassword || !fullname) 
            return res.status(400).json({success: false, errorMessage: "please enter all required fields."});

        // TEST IF PASSWORD LENGTH < 6 CARACTERS
        if (password.length < 6 ) return res.status(400).json({success: false, errorMessage: "please enter a password of at least 6 characters."});

        // TEST IF PASSWORD AND PASSWORD VERIFICATION ARE NOT THE SAME
        if (password !== repeatPassword) return res.status(400).json({success: false, errorMessage: "please enter the same password twice."});

        // VERIFY IF A USER WITH THE SAME USERNAME EXISTS
        const existingUser = await User.findOne({username});
        if(existingUser) return res.status(400).json({success: false, errorMessage: "An account with this email already exists."});

        // ***** ALL GOOD *****
        // GENERATING A SALT AND CREATING A HASHED PASSWORD
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        // GENERATE A RANDOM STRING FOR SENDING THE MAIL
        const uniqueString = randString()

        // SAVING THE NEW USER TO THE DB (USERNAME AND THE HASHED VERSION OF THE PASSWORD)
        const newUser = new User({username, fullname, uniqueString, passwordHash});
        const savedUser = await newUser.save();

        // SEND EMAIL
        sendEmail(username, uniqueString)

        // SIGN THE TOKEN WITH SOME USER DATA THAT WE WILL NEED 
        const token = jwt.sign({
            id: savedUser._id, 
            username: savedUser.username, 
            fullname: savedUser.fullname,
            userImage: savedUser.userImage
        }, JWT_SECRET);

        // SEND THE TOKEN IN A HTTP-Only COOKIE
        res.cookie("authToken", token, {
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
        const {username, password, rememberMe} = req.body;

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
            fullname: existingUser.fullname,
            userImage: existingUser.userImage
        }, JWT_SECRET);

        // SEND THE TOKEN IN A HTTP-Only COOKIE
        if (rememberMe){
            res.cookie("authToken", token, {
                httpOnly: true
            });
        }else{
            res.cookie("authToken", token, {
                httpOnly: true,
                expires: new Date(new Date().getTime()+(1*60*60*1000)) //after 1 hour
            });
        }        

        // SEND BACK THE DATA
        res.json({success: true, message: `welcome back ${username}`}).send();

    } catch(err) {

        // IF THERE IS AN ERROR WE SEND A STATUS CODE 500 WITH AN ERROR MESSAGE
        res.status(500).send({success: false, errorMessage: "Internal server error", error: err});
    }
}

module.exports.logoutUser = (req, res) =>{
    // DELETING THE TOKEN
    res.cookie("authToken", "", {
        httpOnly: true,
        expires: new Date(0)
    });

     // SEND BACK THE DATA
     res.json({success: true, message: `See you soon`}).send();
}

module.exports.isLoggedIn = (req, res)=>{
    try {
        const token = req.cookies.authToken;

        // IF USER IS NOT LOGGED IN
        if (!token) return res.json({success: false});

        // IF THERE IS A TOKEN, WE VERIFY IT
        const verified = jwt.verify(token, process.env.JWT_SECRET);

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

module.exports.checkEmail = async (req, res)=>{
    try {
        const username = req.params.email;
        
        const exists = await User.findOne({username});

        if (exists) return res.json({accept: false})
        return res.json({accept:true})

    } catch(err) {

        // IF THERE IS AN ERROR WE SEND A STATUS CODE 500 WITH AN ERROR MESSAGE
        res.status(500).send({success: false, errorMessage: "Internal server error", error: err});
    }
}

module.exports.verifyEmail = async (req, res)=>{
    try {
        const uniqueString = req.params.uniqueString;
        
        const user = await User.findOne({uniqueString: uniqueString})
        if (user){
            user.isVerified = true;
            await user.save()
            res.json({success: true, message: "User verified successfully"}).redirect("/")
        }else{
            res.json({success: false, message: "User not found"})
        }

    } catch(err) {

        // IF THERE IS AN ERROR WE SEND A STATUS CODE 500 WITH AN ERROR MESSAGE
        res.status(500).send({success: false, errorMessage: "Internal server error", error: err});
    }
}

function randString(){
    const len=12;
    let randStr = '';
    for (let i=0; i<len; i++) {
        const ch = Math.floor((Math.random() * 10 ) +1);
        randStr += ch;
    }
    return randStr
}

function sendEmail(email, uniqueString){
    var transport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            type: 'OAuth2',
            user: MAIL_USERNAME,
            pass: MAIL_PASSWORD,
            clientId: process.env.OAUTH_CLIENTID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            refreshToken: process.env.OAUTH_REFRESH_TOKEN
        }
    });
    let mailOptions = {
        from: MAIL_USERNAME,
        to: email,
        subject: "Email confirmation",
        html: `Press <a href=http://localhost:3001/api/auth/verify/${uniqueString}> 
        here </a> to verify your email.<br>Thanks.`
    }
    transport.sendMail(mailOptions, (err, res)=>{
        if (err){
            console.log(err);
        }else {
            console.log("Message sent")
        }
    })
}