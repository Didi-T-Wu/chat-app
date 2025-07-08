import React,  { createContext, useState, useEffect }  from 'react';
import { generateColorFromUsername } from '../helperFunctions';
const AuthContext = createContext()

const AuthProvider = ({children}) => {
  console.log("AuthProvider component is rendering");

  const [tabId, setTabId] = useState(sessionStorage.getItem('tabId') || crypto.randomUUID())
  const [curUser, setCurUser] = useState(()=> { //curUser = { username: "Alice", avatarBgColor:"pink" }
    const stored = sessionStorage.getItem(`curUser_${tabId}`)
    return stored? JSON.parse(stored): null
  })
  const [token, setToken] = useState(sessionStorage.getItem(`token_${tabId}`)|| '')


  // 20250702
  const [isAuthenticated, setIsAuthenticated] = useState(false)


  let avatarBgColor = ''

  useEffect(()=> {
    console.log("useEffect in AuthProvider running");

    if(!sessionStorage.getItem('tabId')){
      sessionStorage.setItem('tabId', tabId)
    }

    //after refresh page
    const token = sessionStorage.getItem(`token_${tabId}`)
    const stored = sessionStorage.getItem(`curUser_${tabId}`)
    const curUser = stored? JSON.parse(stored): null

    if(token && curUser){
      setToken(token)
      setCurUser(curUser)
      setIsAuthenticated(true)
    }

  },[curUser?.username,token, tabId])


  const authenticate = (username, token)=> {
    console.log('authenticate called')
    avatarBgColor = generateColorFromUsername(username)
    const userObj = { username:username, avatarBgColor: avatarBgColor }
    setCurUser(userObj)
    setToken(token)
    setIsAuthenticated(true)

    sessionStorage.setItem(`curUser_${tabId}`, JSON.stringify(userObj))
    sessionStorage.setItem(`token_${tabId}`, token)
  }

  const logout = () => {
    console.log('logout called')
      setCurUser(null);
      setToken('')
      setTabId('')
      setIsAuthenticated(false)

      sessionStorage.removeItem(`curUser_${tabId}`)
      sessionStorage.removeItem(`token_${tabId}`)
      sessionStorage.removeItem('tabId')
  }

  return (
      <AuthContext.Provider value={{curUser, avatarBgColor, tabId, token, isAuthenticated, authenticate, logout  }}>
          {children}
      </AuthContext.Provider>
  );
}

export { AuthProvider , AuthContext }