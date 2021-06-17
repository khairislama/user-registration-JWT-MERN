import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios';

const AuthConext = createContext();

function AuthContextProvider(props) {
    const [loggedIn, setLoggedIn] = useState(undefined);

    async function getLoggedIn(){
        try {
          const loggedInRes = await axios.get("http://localhost:3001/api/auth/loggedIn");
          setLoggedIn(loggedInRes.data);
        }catch(err){
          setLoggedIn({success: false, errorMessage: "Internal server error", error: err})
        }
    }

    useEffect(()=>{
        getLoggedIn();
    }, [])

  return (
    <AuthConext.Provider value={{loggedIn, getLoggedIn}}>
      { props.children }
    </AuthConext.Provider>
  )
}

export default AuthConext;
export {AuthContextProvider};