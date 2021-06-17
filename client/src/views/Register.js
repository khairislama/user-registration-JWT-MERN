import React, { useContext, useRef, useState } from 'react'
import '../assets/stylesheets/login.css'
import axios from 'axios'
import { useHistory } from 'react-router'
import AuthConext from '../context/AuthContext'

export default function Register() {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [repeatPassword, setRepeatPassword] = useState("")
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [firstnameInput, setFirstnameInput] = useState("")
    const [lastnameInput, setLastnameInput] = useState("")
    const [identicalPasswords, setIdenticalPasswords] = useState(true)
    const {getLoggedIn} = useContext(AuthConext);
    const acceptConditions = useRef(false)
    const submitButton = useRef(undefined)
    const history = useHistory();


    async function handleRegister(e){
        //HERE GOES THE HANDLER OF THE REGISTER 
        e.preventDefault()
        try {
            const registerData = {
                username,
                firstname,
                lastname,
                password,
                repeatPassword
            }
            await axios.post("http//localhost:3001/api/auth/register", registerData)
            await getLoggedIn();
            history.push("/");
        } catch(err) {
            console.error(err)
        }
    }

    async function checkEmailValidation(){
        try {
            await axios.head("http//localhost:3001/api/auth/email")
        } catch(err) {
            console.error(err)
        }
    }

    function checkPassword(){
        if (repeatPassword === password) return setIdenticalPasswords(true)
        else return setIdenticalPasswords(false)
    }

    function checkPasswordSecurity(){
        // HERE GOES THE ALGO THE CHECK PASSWORD SECURITY
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
                        <button className="btn btn-facebook col-3"><i className="fab fa-facebook-f"></i></button>
                        <button className="btn btn-google col-3"><i className="fab fa-google"></i></button>
                    </div>
                    <span className="text-center my-3 d-block mt-4">or</span>  
                    <form onSubmit={handleRegister} >
                        <div className="form-group first registerInput">
                        <label htmlFor="username">Username</label>
                        <input type="text" className="form-control my-2" placeholder="your-email@gmail.com" id="username"
                            name="username" value={username} onChange={(e)=>setUsername(e.target.value)} required
                            onBlur={checkEmailValidation}
                        /> 
                        </div>
                        <div className="form-group first registerInput">
                        <label htmlFor="Firstname">First Name</label>
                        <input type="text" className={`form-control my-2 ${firstnameInput}`} placeholder="your first name" id="Firstname" 
                            name="firstname" value={firstname} onChange={(e)=>setFirstname(e.target.value)} required
                            onBlur={()=>{(firstname.length < 3) ? setFirstnameInput("invalid") : setFirstnameInput("valid") }}
                        />
                        </div>
                        <div className="form-group first registerInput">
                        <label htmlFor="Lastname">Last Name</label>
                        <input type="text" className={`form-control my-2 ${lastnameInput}`} placeholder="your last name" id="Lastname" 
                            name="lastname" value={lastname} onChange={(e)=>setLastname(e.target.value)} required
                            onBlur={()=>{(lastname.length < 3) ? setLastnameInput("invalid") : setLastnameInput("valid") }}
                        />
                        </div>
                        <div className="form-group last my-3 registerInput">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control my-2" placeholder="Your Password" id="password" 
                            name="password" value={password} onChange={(e)=>{setPassword(e.target.value); setRepeatPassword("")}} required
                            onBlur={checkPasswordSecurity}
                        />
                        </div>        
                        <div className="form-group last my-3 registerInput">
                        <label htmlFor="password2">Repeat Password</label>
                        <input type="password" className="form-control my-2" placeholder="Repeat Password" id="password2" 
                            name="repeatPassword" value={repeatPassword} onChange={(e)=>setRepeatPassword(e.target.value)} required
                            onBlur={checkPassword}
                        />
                        </div>           
                        <div className="d-sm-flex mb-5 align-items-center form-check">
                        <input ref={acceptConditions} className="form-check-input" type="checkbox" value="" if="acceptConditions" />
                        <label className="mb-sm-0 col-11 form-check-label" htmlFor="acceptConditions">
                            <span className="ms-2 text-muted" style={{ fontSize:"12px" }} >I have read and accepted the website's General Conditions of Use</span>
                        </label>
                        </div> 
                        <input ref={submitButton} type="submit" value="Register" className="btn col-12 py-2 btn-primary" disabled />                 
                    </form>
                    </div>
                </div>
                </div>
            </div>
        </div>    
        <div className="bg" style={{ backgroundImage: "url('/images/bg_1.jpg')" }}></div>
    </div>
    </div>
  )
}
