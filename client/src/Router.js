import React, { useContext } from 'react'
import Login from './views/Login'
import Register from './views/Register'
import { BrowserRouter , Switch, Route, Redirect } from 'react-router-dom'
import Home from './views/Home'
import Secret from './views/Secret'
import AuthConext from './context/AuthContext'
import ResetPasswordForm from './views/ResetPasswordForm'

export default function Router() {
  const {loggedIn} = useContext(AuthConext);
  return (
    <BrowserRouter>
      <Switch>
          <Route path="/" exact >
            <Home />
          </Route>   
          <Route path="/reset/:userID/:token" exact >
            <ResetPasswordForm />
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
                <Route path="/secret" exact render={props =>{
                  return <Redirect to={{
                    pathname: "/login",
                    state: {
                      from: props.location
                    }
                  }} />
                }}/>
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
