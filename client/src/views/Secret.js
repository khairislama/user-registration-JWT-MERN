import React, { useContext } from 'react'
import { useHistory } from 'react-router';
import AuthConext from '../context/AuthContext'

export default function Secret() {
  const { loggedIn } = useContext(AuthConext);
  const history = useHistory();

  return (      
    <div>
      <h1>Secret page</h1>
      {
        loggedIn?.success === false && history.push("/login")
      }
    </div>
  )
}
