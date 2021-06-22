import React, { useContext, useRef, useState } from 'react'
import { useHistory } from 'react-router';
import '../assets/stylesheets/login.css'
import axios from 'axios'
import AuthConext from '../context/AuthContext';

export default function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const {getLoggedIn} = useContext(AuthConext);
    const history = useHistory();
    const rememberMe = useRef(false);

    async function login(e){
        e.preventDefault();
        try{
            const loginData = {
                username,
                password,
                rememberMe: rememberMe.current.checked
            }
            const loginTry = await axios.post("http://localhost:3001/api/auth/login", loginData)
            if (loginTry.data.success){
                await getLoggedIn()
                history.push("/")
            }
        }catch(err){
            console.error(err)
        }
    }

    async function handleForgotPasswordSubmit(e){        
        e.preventDefault();
        try{
            if (username.length < 10) return setEmailInput("feelUp")
            const emailNotExistInDb = await axios.get(`http://localhost:3001/api/auth/${username}`);
            if (emailNotExistInDb.data.accept) return setEmailInput("invalid");
            if (emailNotExistInDb.data.accept === false) {
                const resetData = await axios.post("http://localhost:3001/api/auth/reset-password", {username})
                if (resetData.data.success){
                    setEmailInput("valid")
                }
            }            
        }catch(err){
            console.error(err)
        }
    }

    async function loginFacebook(){
        // HERE GOES THE LOGIN FACEBOOK ALGO
    }

    async function loginGmail(){
        // HERE GOES THE LOGIN GMAIL ALGO
    }

  return (
    <div className="login">
    <div className="d-md-flex half">
        <div className="bg" style={{ backgroundImage: "url('/images/bg_1.jpg')" }}></div>
        <div className="contents">
            <div className="container">
                <div className="row align-items-center justify-content-center">
                <div className="col-md-12">
                    <div className="form-block mx-auto">
                    <div className="text-center mb-5">
                        <h3 className="text-uppercase">Login to <strong>USER AUTHS</strong></h3>
                    </div>
                    <form onSubmit={login} >
                        <div className="form-group first">
                        <label htmlFor="username">Username</label>
                        <input type="text" 
                            className="form-control my-2" placeholder="your-email@gmail.com" id="username"
                            value={username} name="username" required
                            onChange={(e)=> setUsername(e.target.value)}
                        />
                        {
                            emailInput === "valid" && 
                                <p style={{color:"green", fontSize:"11px"}}>
                                    ✓ Token sent, please check you're email to reset your password ✓
                                </p>
                        }
                        {
                            emailInput === "invalid" && 
                                <button style={{color:"red", fontSize:"11px"}}
                                onClick={()=>{
                                    history.push("/login")
                                }} className="loginA forgot-password mb-2" >
                                    X This email does not exists in our database, click me to create a new account X
                                </button>
                        }
                        {
                            emailInput === "feelUp" && 
                                <button style={{color:"red", fontSize:"11px"}}
                                onClick={()=>{
                                    history.push("/login")
                                }} className="loginA forgot-password mb-2" >
                                    X Please enter your email here X
                                </button>
                        }
                        </div>
                        <div className="form-group last my-3">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control my-2" 
                            placeholder="Your Password" id="password"
                            value={password} name="password" required
                            onChange={ (e)=> setPassword(e.target.value) } 
                        />
                        </div>                
                        <div className="d-sm-flex mb-5 align-items-center form-check">
                        <input ref={rememberMe} className="form-check-input" type="checkbox" if="rememberMe" />
                        <label className="mb-sm-0 col-8 form-check-label" htmlFor="rememberMe">
                            <span className="ms-3">Remember me</span>
                        </label>
                        <span className="ms-auto">
                            <button onClick={handleForgotPasswordSubmit} className="loginA forgot-pass">Forgot Password</button>
                        </span>                         
                        </div>
                        <button onClick={()=>history.push("/register")} className="loginA forgot-pass">Create an account ?</button>
                        <input type="submit" value="Log In" className="btn col-12 py-2 btn-primary" />
                        <span className="text-center my-3 d-block">or</span>                                
                        <div className="">
                        <button onClick={loginFacebook} className="loginA btn col-12 py-2 my-1 btn-facebook">
                            <i className="fab fa-facebook-f me-3"></i> Login with facebook
                        </button>
                        <button onClick={loginGmail} className="loginA btn col-12 py-2 my-1 btn-google">
                            <i className="fab fa-google me-3"></i> Login with Google
                        </button>
                        <button onClick={loginGmail} className="loginA btn col-12 py-2 my-1 btn-github">
                            <i className="fab fa-github me-3"></i> Login with Github
                        </button>
                        <button onClick={loginGmail} className="loginA btn col-12 py-2 my-1 btn-linkedIn">
                            <i className="fab fa-linkedin me-3"></i> Login with LinkedIn
                        </button>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
            </div>
        </div>            
    </div>
    </div>
  )
}
