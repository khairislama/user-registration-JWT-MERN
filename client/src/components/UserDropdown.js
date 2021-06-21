import React, { useContext } from 'react'
import axios from 'axios'
import { NavDropdown } from 'react-bootstrap'
import AuthConext from '../context/AuthContext';

export default function UserDropdown() {
    const {getLoggedIn} = useContext(AuthConext);
    const {loggedIn} = useContext(AuthConext);

    async function logout(){
        await axios.get("http://localhost:3001/api/auth/logout");
        await getLoggedIn();
    }

  return (
        <NavDropdown
            title={
                <>
                <img 
                    src={`/uploads/users/${loggedIn.userInfo.userImage}`} 
                    id="user-image" 
                    className="rounded-circle me-3"             
                    style={{width:"28px", height:"28px"}}
                    alt="user"
                /> 
                <span style={{ color: 'white' }}>{loggedIn.userInfo.fullname}</span>
                </>
            }
            id="nav-dropdown"
        >
        <NavDropdown.Item href="#/action-1">Action</NavDropdown.Item>
        <NavDropdown.Item href="#/action-2">Another action</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item onClick={logout}><i className="fas fa-sign-out-alt me-2"></i>Logout</NavDropdown.Item>
    </NavDropdown>
  )
}
