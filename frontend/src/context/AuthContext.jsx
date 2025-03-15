import React,  { createContext, useState, useEffect,  useRef }  from 'react';

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
    const response = await fetch('/api/users/active')
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

     // Load current user from sessionStorage(tab-specific)
    const storedCurUser = sessionStorage.getItem(`curUser_${tabId}`)
    console.log("storedCurUser in AuthProvider", storedCurUser)
    if(storedCurUser){
      setCurUser(storedCurUser)
    }

    //load tabId from sessionStorage
    const storedTabId = sessionStorage.getItem('tabId')
    console.log("storedTabId in AuthProvider", storedTabId)
    if(storedTabId){
      setTabId(storedTabId)
    }

    // Load token from sessionStorage(tab-specific)
    const storedToken = sessionStorage.getItem(`token_${tabId}`)
    console.log("storedToken in AuthProvider", storedToken)
    if(storedToken){
      setToken(storedToken)
    }

    // Load active users only after authentication or session changes
    if (curUser && token) {
      loadActiveUsers().then((data) => setUsers(data));
    }

    //TODO: use beacon API to send a request to the server when the tab is closed
    const handleTabClose = () => {
      console.log("Tab is closing");
      // use beacon API to send a request to the server
      // use hidepage to tell when the tab is closed not refreshed
      // Clear curUser and token from sessionStorage // call logout??
      // what about fetch in logout??
    };

    window.addEventListener('beforeunload', handleTabClose);
    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
    };

  },[curUser, users, token, tabId])


  const authenticate = (username, token)=> {
    console.log('authenticate called')

    // Avoid duplicates in the users list
    setUsers((prevUsers) => {
      if (!prevUsers.includes(username)) {
        return [...prevUsers, username];
      }
      return prevUsers;
    });

    // TODO: do I associate the token with the username?
    // curUser {username: token}??
    setCurUser(username)
    setToken(token)

    sessionStorage.setItem(`curUser_${tabId}`, username)
    sessionStorage.setItem(`token_${tabId}`, token)
  }

  const logout = async (tabId) => {
    console.log('logout called')
    await fetch('/api/logout')
    setUsers([])

    // Clear curUser and token from sessionStorage

    setCurUser('');
    setToken('')
    sessionStorage.removeItem(`curUser_${tabId}`)
    sessionStorage.removeItem(`token_${tabId}`)

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