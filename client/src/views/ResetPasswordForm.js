import React, { useContext, useState } from 'react'
import { Container, Form, Button } from 'react-bootstrap'
import PasswordStrengthBar from 'react-password-strength-bar'
import axios from 'axios'
import AuthConext from '../context/AuthContext';
import { useRouteMatch, useHistory } from 'react-router-dom';

export default function ResetPasswordForm() {
    let match = useRouteMatch();
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [identicalPasswords, setIdenticalPasswords] = useState("");
    const [errorMessage, setErrorMessage] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { getLoggedIn } = useContext(AuthConext);
    const history = useHistory();

    async function handleResetSubmit(e){
        e.preventDefault();
        if (passwordInput === "invalid" ||
        identicalPasswords === "invalid")
        return setErrorMessage(true)
        try {
            const registerData = {
                password,
                repeatPassword,
                userID: match.params.userID,
                token: match.params.token
            };
            await axios.put("http://localhost:3001/api/auth/reset-password", registerData);
            await getLoggedIn();
            history.push("/");
        } catch(err) {
            console.error(err);
        }
    }

  return (
    <Container className="mt-5">
      <Form onSubmit={handleResetSubmit} >          
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
            <div className="d-grid gap-2 col-6 mx-auto">
                <Button type="submit" className="mt-3 block" size="lg">Create new password</Button>
            </div>
            {
                errorMessage && (
                    <p style={{color:"red", fontSize:"11px"}}>
                        X Please! all fields are required X
                    </p>
                )
            }
      </Form>
    </Container>
  )
}
