const User              = require("../models/user.model");
const ResetPassword     = require("../models/resetPassword.model")
const bcrypt            = require("bcryptjs");
const jwt               = require("jsonwebtoken");
const crypto            = require("crypto");
const fetch             = require('node-fetch');
const {OAuth2Client}    = require('google-auth-library');
const nodemailer        = require("nodemailer");
const JWT_SECRET        = process.env.JWT_SECRET || "hello there this is a secret message that you need to change"
const MAIL_USERNAME     = process.env.MAIL_USERNAME || "Put you gmail here"
const MAIL_PASSWORD     = process.env.MAIL_PASSWORD || "Put your password here"
const client            = new OAuth2Client(process.env.OAUTH_CLIENTID);

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
        const uniqueString = crypto.randomBytes(32).toString('hex');

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
     res.json({success: true, message: `See you soon`});
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
            res.json({success: true, message: "User verified successfully"})
        }else{
            res.json({success: false, message: "User not found"})
        }

    } catch(err) {

        // IF THERE IS AN ERROR WE SEND A STATUS CODE 500 WITH AN ERROR MESSAGE
        res.status(500).send({success: false, errorMessage: "Internal server error", error: err});
    }
}

module.exports.checkResetPassword = async (req, res)=>{
    try{
        const username = req.body.username;
        const user = await User.findOne({username});
        const tokenHash = crypto.randomBytes(32).toString('hex');
        const existingRset = await ResetPassword.findOne({userID: user._id});
        if (existingRset) await ResetPassword.findByIdAndRemove(existingRset._id)
        ResetPassword.create({userID: user._id, resetPasswordToken: tokenHash, expire: new Date(new Date().getTime()+(1*60*60*1000)) });        
        sendResetMail(username, tokenHash, user._id);
        console.log("mail sent")

    } catch(err) {
        // IF THERE IS AN ERROR WE SEND A STATUS CODE 500 WITH AN ERROR MESSAGE
        res.status(500).send({success: false, errorMessage: "Internal server error", error: err});
    }
}

module.exports.resetPassword = async (req, res)=>{
    try{
        const {userID, token, password, repeatPassword } = req.body;

        // ***** VERIFICATIONS *****
        // TEST IF A FIELD IS EMPTY
        if (!password || !repeatPassword) 
            return res.status(400).json({success: false, errorMessage: "please enter all required fields."});

        // TEST IF PASSWORD LENGTH < 6 CARACTERS
        if (password.length < 6 ) return res.status(400).json({success: false, errorMessage: "please enter a password of at least 6 characters."});

        // TEST IF PASSWORD AND PASSWORD VERIFICATION ARE NOT THE SAME
        if (password !== repeatPassword) return res.status(400).json({success: false, errorMessage: "please enter the same password twice."});
        
        // TOKEN
        const passwordtoReset = await ResetPassword.findOne({userID});
        if (token !== passwordtoReset.resetPasswordToken) return res.status(401).json({success: false, errorMessage: "wrong token please retry again later, If this errer persists, please contact US"});
        
        // VERIFY EXPIRE DATE
        const datenow = new Date();
        if (datenow > passwordtoReset.expire) return res.status(401).json({success: false, errorMessage: "token expired"});
        
        // ***** ALL GOOD *****
        //create a password hash
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await User.findById(userID);
        user.passwordHash = passwordHash;
        await user.save();
        await ResetPassword.findByIdAndRemove(passwordtoReset._id);
        // SIGN THE TOKEN WITH SOME USER DATA THAT WE WILL NEED 
        const newToken = jwt.sign({
            id: user._id, 
            username: user.username, 
            fullname: user.fullname,
            userImage: user.userImage
        }, JWT_SECRET);

        // SEND THE TOKEN IN A HTTP-Only COOKIE
        res.cookie("authToken", newToken, {
            httpOnly: true,
        });

        // SEND BACK THE DATA
        res.json({success: true, message: "password changed successfully"}).send();

    } catch(err) {
        // IF THERE IS AN ERROR WE SEND A STATUS CODE 500 WITH AN ERROR MESSAGE
        res.status(500).send({success: false, errorMessage: "Internal server error", error: err});
    }
}

module.exports.facebookLogin = async (req, res)=>{
    try {
        const {userID, accessToken} = req.body;
        var token;
        let urlGraphFacebook = `https://graph.facebook.com/v11.0/${userID}/?fields=id,name,email&access_token=${accessToken}`;
        fetch(urlGraphFacebook, {
            method: "GET"
        }).then(res => res.json())
        .then(async (response)=>{
            const {email, name} = response;
            const user = await User.findOne({username: email});
            if (!user){           
                let password = email+JWT_SECRET;
                const salt = await bcrypt.genSalt();
                const passwordHash = await bcrypt.hash(password, salt);
                const uniqueString = crypto.randomBytes(32).toString('hex');
                let newUser = new User({fullname: name, username: email, passwordHash, uniqueString});
                const createdUser = await newUser.save();
                // SEND EMAIL
                sendEmail(username, uniqueString)
                token = jwt.sign({
                    id: createdUser._id, 
                    username: createdUser.username, 
                    fullname: createdUser.fullname,
                    userImage: createdUser.userImage
                }, JWT_SECRET, {expiresIn: '7d'});
                res.cookie("authToken", token, {
                    httpOnly: true
                });
                // SEND BACK THE DATA
                res.json({success: true, message: "LoggedIn successfully"}).send();
            }else{
                token = jwt.sign({
                    id: user._id, 
                    username: user.username, 
                    fullname: user.fullname,
                    userImage: user.userImage
                }, JWT_SECRET, {expiresIn: '7d'});
                res.cookie("authToken", token, {
                    httpOnly: true,
                });
                // SEND BACK THE DATA
                res.json({success: true, message: "LoggedIn successfully"}).send();
            }
        });
    } catch(err) {
        // IF THERE IS AN ERROR WE SEND A STATUS CODE 500 WITH AN ERROR MESSAGE
        res.status(500).send({success: false, errorMessage: "Internal server error", error: err});
    }
    
}

module.exports.googlelogin = async (req, res)=>{
    try{
        const { tokenId } = req.body;
        const ticket = await client.verifyIdToken({idToken: tokenId, audience: process.env.OAUTH_CLIENTID})
        const payload = ticket.getPayload()
        if (!payload.email_verified) return res.status(204).json({success: false, errorMessage: 'No content found please retry later'});
        const user = await User.findOne({username: payload.email});
        if (user) {
            const token = jwt.sign({
                id: user._id, 
                username: user.username, 
                fullname: user.fullname,
                userImage: user.userImage
            }, JWT_SECRET, {expiresIn: '7d'});
            res.cookie("authToken", token, {
                httpOnly: true
            });
            // SEND BACK THE DATA
            res.status(200).json({success: true, message: "LoggedIn successfully"}).send();
        }
        if (!user) {
            let password = payload.email+JWT_SECRET;
            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(password, salt);
            const uniqueString = crypto.randomBytes(32).toString('hex');
            let newUser = new User({fullname: payload.name, username: payload.email, passwordHash, uniqueString});
            const user = await newUser.save();
            // SEND EMAIL
            sendEmail(user.username, uniqueString)
            if (!user) return res.status(400).json({success: false, errorMessage: 'Something went wrong...'});
            const token = jwt.sign({
                id: user._id, 
                username: user.username, 
                fullname: user.fullname,
                userImage: user.userImage
            }, JWT_SECRET, {expiresIn: '7d'});
            res.cookie("authToken", token, {
                httpOnly: true
            });
            // SEND BACK THE DATA
            res.status(200).json({success: true, message: "LoggedIn successfully"}).send();
        }
    } catch(err) {
        // IF THERE IS AN ERROR WE SEND A STATUS CODE 500 WITH AN ERROR MESSAGE
        res.status(500).send({success: false, errorMessage: "Internal server error", error: err});
    }
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

function sendResetMail(username, tokenHash, userID){
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
        to: username,
        subject: 'Reset your account password',
        html: '<h4><b>Reset Password</b></h4>' +
        '<p>To reset your password, complete this form:</p>' +
        '<a href="http://localhost:3000/reset/' + userID + '/' + tokenHash + '">By pressing here</a>' +
        '<br><br>' +
        '<p>--Team</p>'
    }
    transport.sendMail(mailOptions, (err, res)=>{
        if (err){
            res.json({success: false, errorMessage: 'Unable to send email.'});
        }else {
            res.json({success: true, message: 'Check your mail to reset your password.'});
        }
    })
}