import React, { useContext, useRef, useState } from 'react';
import '../assets/stylesheets/login.css';
import axios from 'axios';
import { useHistory } from 'react-router';
import PasswordStrengthBar from 'react-password-strength-bar';
import { Modal } from 'react-bootstrap';
import AuthConext from '../context/AuthContext';
import GeneralConditionsModel from '../context/GeneralConditionsModel';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

export default function Register() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [fullname, setFullname] = useState("");
    const [fullnameInput, setFullnameInput] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [identicalPasswords, setIdenticalPasswords] = useState("");
    const [errorMessage, setErrorMessage] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const {getLoggedIn} = useContext(AuthConext);
    const acceptConditions = useRef(false);
    const submitButton = useRef(undefined);
    const history = useHistory();


    async function handleRegister(e){
        //HERE GOES THE HANDLER OF THE REGISTER 
        e.preventDefault();
        if (fullnameInput === "invalid" ||
            emailInput === "invalid" ||
            passwordInput === "invalid" ||
            identicalPasswords === "invalid") 
            return setErrorMessage(true)
        try {
            const registerData = {
                username,
                fullname,
                password,
                repeatPassword
            };
            await axios.post("http://localhost:3001/api/auth/register", registerData);
            await getLoggedIn();
            history.push("/");
        } catch(err) {
            console.error(err);
        }
    }

    async function checkEmailValidation(){
        try {
            if (username.length < 15) return false
            const emailNotExistInDb = await axios.get(`http://localhost:3001/api/auth/${username}`);
            (emailNotExistInDb.data.accept) ? setEmailInput("valid") : setEmailInput("invalid");
        } catch(err) {
            console.error(err);
        }
    }

    async function responseFacebook(response){
        const data = {
            accessToken: response.accessToken,
            userID: response.userID
        };
        const loginTry = await axios.post("http://localhost:3001/api/auth/facebooklogin", data);
        if (loginTry.data.success){
            await getLoggedIn()
            history.push("/")
        }
    }

    function closeModal(){
        setModalOpen(false)
    }

  return (
    <div className="register">
    <div className="d-md-flex half">
            <div className="contents">
            <div className="container">
                <div className="row align-items-center justify-content-center">
                <div className="col-md-12">
                    <div className="form-block mx-auto">
                    <div className="text-center mb-5">
                        <h3 className="text-uppercase">Register to <strong>USER AUTHS</strong></h3>
                    </div>
                    <div className="row">
                        <FacebookLogin
                            appId="795123591193192"
                            fields="name,email,picture"
                            callback={responseFacebook}
                            render={renderProps => (
                                <button onClick={renderProps.onClick}
                                className="btn btn-facebook btn-circle col-3 me-4 ms-2"
                                ><i className="fab fa-facebook-f"></i></button>
                              )}
                        /> 
                        <button className="btn btn-google btn-circle col-3 ms-5 me-4"><i className="fab fa-google"></i></button>
                        <button className="btn btn-github btn-circle col-3 ms-5 me-4"><i className="fab fa-github"></i></button>                        
                        <button className="btn btn-linkedIn btn-circle col-3 ms-5"><i className="fab fa-linkedin"></i></button>
                    </div>
                    <span className="text-center my-3 d-block mt-4">or</span>  
                    <form onSubmit={handleRegister} >
                        <div className="form-group first registerInput">
                        <label htmlFor="username">Username</label>
                        <input type="text" className={`form-control my-2 ${emailInput}`} placeholder="your-email@gmail.com" id="username"
                            name="username" value={username} onChange={(e)=>setUsername(e.target.value)} required
                            onBlur={checkEmailValidation}
                        /> 
                        {
                            emailInput === "valid" && 
                                <p style={{color:"green", fontSize:"11px"}}>
                                    ✓ Email valid ✓
                                </p>
                        }
                        {
                            emailInput === "invalid" && 
                                <button style={{color:"red", fontSize:"11px"}}
                                onClick={()=>{
                                    history.push("/login")
                                }} className="loginA forgot-password mb-2" >
                                    X This email already exists in our database, click me to login X
                                </button>
                        }
                        </div>
                        <div className="form-group first registerInput">
                        <label htmlFor="fullname">Full Name</label>
                        <input type="text" className={`form-control my-2 ${fullnameInput}`} placeholder="your full name" id="fullname" 
                            name="fullname" value={fullname} onChange={(e)=>setFullname(e.target.value)} required
                            onBlur={()=>{(fullname.trim().indexOf(' ') !== -1) ? setFullnameInput("valid") : setFullnameInput("invalid") }}
                        />
                        {
                            setFullnameInput === "invalid" && 
                                <p style={{color:"red", fontSize:"11px"}}>
                                    X Please enter a valid first name X
                                </p>
                        }
                        </div>
                        <div className="form-group last my-3 registerInput">
                            <label htmlFor="password">Password</label>
                            <div className="input-group">
                                <input type={(showPassword) ? "text" : "password"}
                                    className={`form-control my-2 ${passwordInput}`} placeholder="Your Password" id="password" 
                                    name="password" value={password} onChange={(e)=>{setPassword(e.target.value); setRepeatPassword("")}} required
                                    onBlur={()=>(password.length < 6) ? setPasswordInput("invalid") : setPasswordInput("valid") } 
                                    aria-describedby="togglePassword"
                                /><i className={`input-group-text far my-2 ${(showPassword) ? "fa-eye" : "fa-eye-slash"}`} 
                                    id="togglePassword" onClick={()=>setShowPassword(!showPassword)} ></i>
                            </div>
                            <PasswordStrengthBar password={password} />
                        </div>        
                        <div className="form-group last my-3 registerInput">
                        <label htmlFor="password2">Repeat Password</label>
                        <input type="password" className={`form-control my-2 ${identicalPasswords}`} placeholder="Repeat Password" id="password2" 
                            name="repeatPassword" value={repeatPassword} onChange={(e)=>setRepeatPassword(e.target.value)} required
                            onBlur={()=>(repeatPassword === password) ? setIdenticalPasswords("valid") : setIdenticalPasswords("invalid") }
                        />
                        {
                            identicalPasswords === "invalid" && 
                                <p style={{color:"red", fontSize:"11px"}}>
                                    X Please enter the same password twice X
                                </p>
                        }
                        </div>           
                        <div className="d-sm-flex mb-5 align-items-center form-check">
                        <input ref={acceptConditions} className="form-check-input" type="checkbox" value="" if="acceptConditions"
                            onChange={()=>{submitButton.current.disabled = !acceptConditions.current.checked}}
                        />
                        <label className="mb-sm-0 col-11 form-check-label" htmlFor="acceptConditions">
                            <span className="ms-2 text-muted" style={{ fontSize:"12px" }} >I have read and accepted the website's  
                            <button onClick={()=> setModalOpen(true)} className="loginA" ><i>&nbsp;General Conditions&nbsp;</i></button> 
                             of Use</span>
                        </label>
                        </div> 
                        {
                            errorMessage && (
                                <p style={{color:"red", fontSize:"11px"}}>
                                    X Please! all fields are required X
                                </p>
                            )
                        }
                        <input ref={submitButton} type="submit" value="Register" className="btn col-12 py-2 btn-primary" disabled />                 
                        <button className="loginA forgot-password" style={{ fontSize:'12px' }}
                         onClick={()=>history.push("/login")} 
                         >Click here to login</button>
                    </form>
                    </div>
                </div>
                </div>
            </div>
        </div>    
        <div className="bg" style={{ backgroundImage: "url('/images/bg_1.jpg')" }}></div>        
    </div>
    <Modal show={modalOpen} onHide={closeModal} >
        <GeneralConditionsModel closeModal={closeModal} />
    </Modal>
    </div>
  )
}
