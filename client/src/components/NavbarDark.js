import React from 'react'
import {Navbar, Nav, Container} from 'react-bootstrap'

export default function NavbarDark() {
  return (
    <Navbar sticky="top" collapseOnSelect expand="md" bg="dark" variant="dark">
        <Container>
        <Navbar.Brand href="/">Home Page</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
            <Nav.Link href="/secret">Secret Page</Nav.Link>
            </Nav>
            <Nav>
            <Nav.Link href="/register">Register</Nav.Link>
            <Nav.Link className="ms-3" href="/login">
                Login
            </Nav.Link>
            </Nav>
        </Navbar.Collapse>
        </Container>
    </Navbar>
  )
}
