import React,  { createContext, useState, useEffect,  useRef }  from 'react';

const AuthContext = createContext()

const AuthProvider = ({children}) => {
  console.log("AuthProvider component is rendering");

  const [users, setUsers] = useState({}) // Store users as { username: token }
  const [curUser, setCurUser] = useState('') // Track current user(username) in this tab
  const isFirstRender = useRef(true);

  useEffect(()=> {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    console.log("useEffect in AuthProvider running");
    // Load all logged-in users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('loggedInUsers')) || {}
    console.log("storedUsers in AuthProvider", storedUsers)
    setUsers(storedUsers)

    // Load current user from sessionStorage(tab-specific)
    const storedCurUser = sessionStorage.getItem('curUser')
    console.log("storedCurUser in AuthProvider", storedCurUser)
    if(storedCurUser && storedUsers[storedCurUser]){
      setCurUser(storedCurUser)
    }

  },[])

  const login = (username, token)=> {
    console.log('login called')
    setUsers(prevUsers => {
     const updatedUsers = {...prevUsers, [username]:token}
     localStorage.setItem('loggedInUsers', JSON.stringify(updatedUsers))
     return updatedUsers
    })
    setCurUser(username)
    sessionStorage.setItem('curUser', username)
    localStorage.setItem(`token_${username}`, token)
  }

  const logout = (username)=> {
    setUsers(prevUsers => {
      const updatedUsers = {...prevUsers}
      delete updatedUsers[username]
      localStorage.setItem('loggedInUsers', JSON.stringify(updatedUsers))
      return updatedUsers
    });

    if (curUser === username){
      setCurUser('');
      sessionStorage.removeItem('curUser')
      localStorage.removeItem(`token_${username}`)
    }

  }

  const getCurUserToken =(username) => {
    return users[username]
  }

  return (
      <AuthContext.Provider value={{users, curUser, login, logout, getCurUserToken }}>
          {children}
      </AuthContext.Provider>
  );
}

export { AuthProvider , AuthContext }