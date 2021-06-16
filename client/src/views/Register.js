import React, { useRef } from 'react'
import '../assets/stylesheets/login.css'

export default function Register() {
    const rememberMe = useRef(true)

    function changeRememberMe(){
        console.log(rememberMe.current.checked) 
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
                        <a className="btn btn-facebook col-3"><i className="fab fa-facebook-f"></i></a>
                        <a className="btn btn-google col-3"><i className="fab fa-google"></i></a>
                    </div>
                    <span className="text-center my-3 d-block mt-4">or</span>  
                    <form action="#" method="post">
                        <div className="form-group first">
                        <label htmlFor="username">Username</label>
                        <input type="text" className="form-control my-2" placeholder="your-email@gmail.com" id="username" />
                        </div>
                        <div className="form-group first">
                        <label htmlFor="Firstname">First Name</label>
                        <input type="text" className="form-control my-2" placeholder="your first name" id="Firstname" />
                        </div>
                        <div className="form-group first">
                        <label htmlFor="Lastname">Last Name</label>
                        <input type="text" className="form-control my-2" placeholder="your last name" id="Lastname" />
                        </div>
                        <div className="form-group last my-3">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control my-2" placeholder="Your Password" id="password" />
                        </div>        
                        <div className="form-group last my-3">
                        <label htmlFor="password">Repeat Password</label>
                        <input type="password" className="form-control my-2" placeholder="Repeat Password" id="password" />
                        </div>           
                        <div className="d-sm-flex mb-5 align-items-center form-check">
                        <input ref={rememberMe} className="form-check-input" type="checkbox" value="" if="rememberMe" onChange={changeRememberMe} />
                        <label className="mb-sm-0 col-11 form-check-label" htmlFor="rememberMe">
                            <span className="ms-2 text-muted" style={{ fontSize:"12px" }} >I have read and accepted the website's General Conditions of Use</span>
                        </label>
                        </div>
                        <input type="submit" value="Register" className="btn col-12 py-2 btn-primary" />
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
