import React,  { createContext, useState, useEffect }  from 'react';
import { API_BASE_URL } from '../config';
const AuthContext = createContext()

const AuthProvider = ({children}) => {
  console.log("AuthProvider component is rendering");

  // TODO: Load users from backend
  const [users, setUsers] = useState([]) // List of active usernames
  const [tabId, setTabId] = useState(sessionStorage.getItem('tabId') || crypto.randomUUID())
  const [curUser, setCurUser] = useState(sessionStorage.getItem(`curUser_${tabId}`)|| '')
  const [token, setToken] = useState(sessionStorage.getItem(`token_${tabId}`)|| '')


  // 20250702
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // const loadActiveUsers = async () => {
  //   console.log("loadActiveUsers called")
  //   const response = await fetch(`${API_BASE_URL}/api/users/active`)
  //   const data = await response.json()
  //   console.log("activeUsers data", data)
  //   return data
  // }

  useEffect(()=> {
    console.log("useEffect in AuthProvider running");

    if(!sessionStorage.getItem('tabId')){
      sessionStorage.setItem('tabId', tabId)
    }

    const token = sessionStorage.getItem(`token_${tabId}`)
    const curUser = sessionStorage.getItem(`curUser_${tabId}`)

    if(token && curUser){
      setToken(token)
      setCurUser(curUser)
      setIsAuthenticated(true)
    }

   // Load active users only after authentication or session changes
    // if (curUser && token) {
    //   console.log('loadActive users')
    // loadActiveUsers().then((activeUsers) => setUsers(activeUsers));
    // }

  },[curUser,token, tabId])


  const authenticate = (username, token)=> {
    console.log('authenticate called')

    // Avoid duplicates in the users list
    // setUsers((prevUsers) => {
    //   if (!prevUsers.includes(username)) {
    //     return [...prevUsers, username];
    //   }
    //   return prevUsers;
    // });

    setCurUser(username)
    setToken(token)
    setIsAuthenticated(true)

    sessionStorage.setItem(`curUser_${tabId}`, username)
    sessionStorage.setItem(`token_${tabId}`, token)
  }

  const logout = () => {
    console.log('logout called')
      setUsers([])
      setCurUser('');
      setToken('')
      setTabId('')
      setIsAuthenticated(false)

      sessionStorage.removeItem(`curUser_${tabId}`)
      sessionStorage.removeItem(`token_${tabId}`)
      sessionStorage.removeItem('tabId')
  }

  return (
      <AuthContext.Provider value={{users, curUser, tabId, token, isAuthenticated, authenticate, logout  }}>
          {children}
      </AuthContext.Provider>
  );
}

export { AuthProvider , AuthContext }