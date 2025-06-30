import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { API_BASE_URL } from '../config';

// const messageHandlers = {
//     newMessage: (data) => {
//         console.log('on new_message');
//         setMessages((prevMessages) => [...prevMessages, data])
//     },
//     userJoined: (data) => {
//         console.log("on user_joined", data);
//         setMessages((prevMessages) => [...prevMessages, data]);
//     },
//     userLeft: (data) => {
//         console.log("on user_left", data);
//         setMessages((prevMessages) => [...prevMessages, data]);
//     },
//     authError: (err) => {
//         console.log("in auth_err", err.msg);
//         console.error(err);
//         navigate("/home");
//     }}



const useSocket = (token, messageHandlers={}) => {

  const [socket, setSocket] = useState(null); // Store socket in state

  let newSocket;
  // Handle Socket Initialization and Listeners
  useEffect(() => {
    if (!token) return; // No socket if no token

    console.log('Initializing socket connection...');
    const timeoutId = setTimeout(()=> {
     const newSocket = io(API_BASE_URL, { query: { token }});
     setSocket(newSocket); // Save socket instance to state

     newSocket.on('connect', () => {
      // const sid = newSocket.id; // Get the WebSocket session ID
      console.log("Connected");

      // store this `sid` in sessionStorage or state for later use
      // sessionStorage.setItem('sid', sid);
    });


    const addSocketListener = (event, handler) => {
        if (handler) newSocket.on(event, handler);
      };

    addSocketListener("new_message", messageHandlers.newMessage);
    addSocketListener("user_left", messageHandlers.userLeft);
    addSocketListener("user_joined", messageHandlers.userJoined)
    addSocketListener("auth_error", messageHandlers.authError)

  }, 500);


  return () => {
        clearTimeout(timeoutId)
        if(newSocket){
          console.log('Disconnecting socket on cleanup...');
          newSocket.disconnect();
          setSocket(null);
        }

    };
  }, [token]);


  return socket
};

export default useSocket;
