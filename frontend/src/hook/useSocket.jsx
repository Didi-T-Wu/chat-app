import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { API_BASE_URL } from '../config';


const useSocket = (token, messageHandlers={}) => {

  const [socket, setSocket] = useState(null); // Store socket in state

  // Handle Socket Initialization and Listeners
  useEffect(() => {
    if (!token) return; // No socket if no token

    console.log('Initializing socket connection...');
    const timeoutId = setTimeout(()=> {
     const newSocket = io(API_BASE_URL, {
      auth: { token },
      autoConnect: false
    });
     setSocket(newSocket); // Save socket instance to state

     newSocket.on('connect', () => {
      console.log("Connected");
    });

    const addSocketListener = (event, handler) => {
        if (handler) newSocket.on(event, handler);
      };

    addSocketListener("new_message", messageHandlers.newMessage);
    addSocketListener("user_left", messageHandlers.userLeft);
    addSocketListener("user_joined", messageHandlers.userJoined)
    addSocketListener("get_active_users", messageHandlers.getActiveUsers)
    addSocketListener("auth_error", messageHandlers.authError)

    newSocket.connect();
  }, 500);


  return () => {
        clearTimeout(timeoutId)
        if(socket){
          console.log('Disconnecting socket on cleanup...');
          socket.disconnect();
          setSocket(null);
        }

    };
  }, [token]);


  return socket
};

export default useSocket;
