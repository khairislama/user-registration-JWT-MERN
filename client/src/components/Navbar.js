import React from 'react'
import '../assets/stylesheets/navbar.css'

export default function Navbar() {
  return (
    <div>
      <div className="top-bar">
        <div className="container">
          <div className="row">
            <div className="col-12">
                <a href="#" className="">
                    <i className="far fa-envelope-open me-2 fa-sm"></i>
                    <span className="d-none d-md-inline-block">info@yourdomain.com</span>
                </a>
                <span className="mx-md-2 d-inline-block"></span>
                <a href="#" className="">
                    <i className="fas fa-phone-alt me-2 fa-sm"></i>
                    <span className="d-none d-md-inline-block">1+ (234) 5678 9101</span>
                </a>
                <div className="float-end">
                    <a href="#" className="">
                        <i className="fab fa-twitter me-2 fa-sm"></i>
                        <span className="d-none d-md-inline-block">Twitter</span>
                    </a>
                    <span className="mx-md-2 d-inline-block"></span>
                    <a href="#" className="">
                        <i className="fab fa-facebook-f me-2 fa-sm"></i>
                        <span className="d-none d-md-inline-block">Facebook</span>
                    </a>
                </div>
            </div>
          </div>
        </div>
      </div>
      <header className="site-navbar js-sticky-header site-navbar-target" role="banner">
        <div className="container">
          <div className="row align-items-center position-relative">
            <div className="site-logo">
                <a href="index.html" className="text-black">
                  <span className="text-primary">Brand</span>
                </a>
            </div>
            <div className="col-12">
              <nav className="site-navigation text-end ms-auto " role="navigation">
                <ul className="site-menu main-menu js-clone-nav ms-auto d-none d-lg-block">
                  <li><a href="#home-section" className="nav-link">Home</a></li>
                  <li><a href="#services-section" className="nav-link">Services</a></li>
                  <li className="has-children">
                    <a href="#about-section" className="nav-link">About Us</a>
                    <ul className="dropdown arrow-top">
                      <li><a href="#team-section" className="nav-link">Team</a></li>
                      <li><a href="#pricing-section" className="nav-link">Pricing</a></li>
                      <li><a href="#faq-section" className="nav-link">FAQ</a></li>
                      <li className="has-children">
                        <a href="#">More Links</a>
                        <ul className="dropdown">
                          <li><a href="#">Menu One</a></li>
                          <li><a href="#">Menu Two</a></li>
                          <li><a href="#">Menu Three</a></li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li><a href="#why-us-section" className="nav-link">Why Us</a></li>
                  <li><a href="#testimonials-section" className="nav-link">Testimonials</a></li>
                  <li><a href="/register" className="nav-link">Register</a></li>
                  <li><a href="/login" className="nav-link">Login</a></li>
                </ul>
              </nav>
            </div>
            <div className="toggle-button d-inline-block d-lg-none">
                <a href="#" className="site-menu-toggle py-5 js-menu-toggle text-black">
                    <span className="icon-menu h3"></span>
                </a>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}
