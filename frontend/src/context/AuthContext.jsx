import React,  { createContext, useState, useEffect,  useRef }  from 'react';
import { API_BASE_URL } from '../config';
const AuthContext = createContext()

const AuthProvider = ({children}) => {
  console.log("AuthProvider component is rendering");

  // TODO: Load users from backend
  const [users, setUsers] = useState([]) // Store users as [username1, username2, ...]
  const [tabId, setTabId] = useState(sessionStorage.getItem('tabId') || crypto.randomUUID()) // Track tabId
  const [curUser, setCurUser] = useState(sessionStorage.getItem(`curUser_${tabId}`)|| '') // Track current user(username) in this tab
  const [token, setToken] = useState(sessionStorage.getItem(`token_${tabId}`)|| '') // Track token for the current user
  const isFirstRender = useRef(true);

  const loadActiveUsers = async () => {
    console.log("loadActiveUsers called")
    const response = await fetch(`${API_BASE_URL}/api/users/active`)
    const data = await response.json()
    console.log("activeUsers data", data)
    return data
  }

  useEffect(()=> {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    console.log("useEffect in AuthProvider running");

    // Save tabId to sessionStorage
    if(!sessionStorage.getItem('tabId')){
      sessionStorage.setItem('tabId', tabId)
    }

    //Load active users only after authentication or session changes
    if (curUser && token) {
      loadActiveUsers().then((activeUsers) => setUsers(activeUsers));
    }

  },[curUser,token, tabId])


  const authenticate = (username, token)=> {
    console.log('authenticate called')

    // Avoid duplicates in the users list
    setUsers((prevUsers) => {
      if (!prevUsers.includes(username)) {
        return [...prevUsers, username];
      }
      return prevUsers;
    });

    setCurUser(username)
    setToken(token)

    sessionStorage.setItem(`curUser_${tabId}`, username)
    sessionStorage.setItem(`token_${tabId}`, token)
  }

  const logout = async (curUser,tabId) => {
    console.log('logout called')
    try {
      const response = await fetch(`${API_BASE_URL}/api/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username:curUser }),
      });


      if (!response.ok) {
        const errorData = await response.json();
        console.error('Logout failed:', errorData)
        throw new Error('Logout failed');
      }
      const data = await response.json()
      console.log(data.msg);

      setUsers([])
      setCurUser('');
      setToken('')

      sessionStorage.removeItem(`curUser_${tabId}`)
      sessionStorage.removeItem(`token_${tabId}`)

    }catch (error) {
      console.error('Logout failed:', error);
    }
  }

  const getCurUserToken =() => {
    console.log('getCurUserToken called')
    return token
  }

  return (
      <AuthContext.Provider value={{users, curUser, tabId,  authenticate, logout, getCurUserToken }}>
          {children}
      </AuthContext.Provider>
  );
}

export { AuthProvider , AuthContext }