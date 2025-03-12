import React,  { createContext, useState, useEffect,  useRef }  from 'react';

const AuthContext = createContext()

// TODO: refactor the AuthProvider component
// signup → Registers the user on the backend, then calls authenticate.
// login → Logs the user in, then calls authenticate.
// authenticate → Handles storing the token, updating users, and setting curUser.
// logout → Logs the user out, then calls authenticate.
// getCurUserToken → Returns the token for the current user.

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

    // Clear username and token from localStorage when the tab is closed
    const handleTabClose = () => {
      if (curUser) {
        const username = sessionStorage.getItem('curUser')
        localStorage.removeItem(`token_${username}`)
        setUsers(prevUsers => {
          const updatedUsers = {...prevUsers}
          delete updatedUsers[username]
          localStorage.setItem('loggedInUsers', JSON.stringify(updatedUsers))
          return updatedUsers
        });
      }
    };

    window.addEventListener('beforeunload', handleTabClose);
    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
    };

  },[curUser])

  const authenticate = (username, token)=> {
    console.log('authenticate called')
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
      <AuthContext.Provider value={{users, curUser, authenticate, logout, getCurUserToken }}>
          {children}
      </AuthContext.Provider>
  );
}

export { AuthProvider , AuthContext }