import React from 'react'
import '../assets/stylesheets/login.css'

export default function Register() {
  return (
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
                    <form action="#" method="post">
                        <div className="form-group first">
                        <label htmlFor="username">Username</label>
                        <input type="text" className="form-control my-2" placeholder="your-email@gmail.com" id="username" />
                        </div>
                        <div className="form-group last my-3">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control my-2" placeholder="Your Password" id="password" />
                        </div>                
                        <div className="d-sm-flex mb-5 align-items-center form-check">
                        <input ref={rememberMe} className="form-check-input" type="checkbox" value="" if="rememberMe" onChange={changeRememberMe} />
                        <label className="mb-sm-0 col-8 form-check-label" htmlFor="rememberMe">
                            <span className="ms-2">Remember me</span>
                        </label>
                        <span className="ml-auto">
                            <a href="#" className="forgot-pass">Forgot Password</a>
                        </span> 
                        </div>
                        <input type="submit" value="Log In" className="btn col-12 py-2 btn-primary" />
                        <span className="text-center my-3 d-block">or</span>                                
                        <div className="">
                        <a href="#" className="btn col-12 py-2 my-2 btn-facebook">
                            <i className="fab fa-facebook-f me-3"></i> Login with facebook
                        </a>
                        <a href="#" className="btn col-12 py-2 btn-google">
                            <i className="fab fa-google me-3"></i> Login with Google
                        </a>
                        </div>
                    </form>
                    </div>
                </div>
                </div>
            </div>
        </div>    
    </div>
  )
}
