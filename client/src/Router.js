import React from 'react'
import Login from './views/Login'
import Register from './views/Register'
import { BrowserRouter , Switch, Route } from 'react-router-dom'
import Home from './views/Home'
import Secret from './views/Secret'

export default function Router() {
  return (
    <BrowserRouter>
      <Switch>
            <Route path="/" exact >
              <Home />
          </Route>
          <Route path="/secret" exact >
              <Secret />
          </Route>
          <Route path="/login" exact >
              <Login />
          </Route>
          <Route path="/register" exact >
              <Register />
          </Route>
      </Switch>
    </BrowserRouter>
  )
}
