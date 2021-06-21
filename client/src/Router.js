import React, { useContext } from 'react'
import Login from './views/Login'
import Register from './views/Register'
import { BrowserRouter , Switch, Route } from 'react-router-dom'
import Home from './views/Home'
import Secret from './views/Secret'
import AuthConext from './context/AuthContext'

export default function Router() {
  const {loggedIn} = useContext(AuthConext);
  return (
    <BrowserRouter>
      <Switch>
            <Route path="/" exact >
              <Home />
          </Route>          
          {
            loggedIn?.success === false && (
              <>
                <Route path="/login" exact >
                    <Login />
                </Route>
                <Route path="/register" exact >
                    <Register />
                </Route>
              </>
            )
          }    
          {
            loggedIn?.success === true && (
              <>
                <Route path="/secret" exact >
                  <Secret />
                </Route>
              </>
            )
          }             
      </Switch>
    </BrowserRouter>
  )
}
