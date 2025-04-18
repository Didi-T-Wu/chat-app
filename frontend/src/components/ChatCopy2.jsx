import React, { useState, useEffect, useContext, useRef } from "react";
import { io } from "socket.io-client";
import { useNavigate, Link } from 'react-router-dom'
import { API_BASE_URL } from '../config';
import { AuthContext } from "../context/AuthContext";

//TODO: double check if useEffect mounted and unmounted correctly
const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const socketRef = useRef(null);  // Use ref to persist socket instance across renders
  const navigate = useNavigate();
  const { curUser, tabId, getCurUserToken, logout, token} = useContext(AuthContext);
  console.log('Chat component rendering socketRef.current',socketRef.current);

  // 1. Handle Authentication (Token validation and Navigation)
  useEffect(() => {
    console.log('useEffect in Chat.js for Handle Authentication running')
    console.log('useEffect in Chat.js before getCurUserToken called');
    console.log('useEffect in Chat.js curUser', curUser);
    const curUserToken = token; // change back to getCurUserToken
    console.log('token from localStorage in useEffect in Chat.js', curUserToken);

    if (!curUserToken) {
      console.log('no token');
      navigate('/login'); // Redirect to login if token is missing
    }
    if(curUserToken && curUser){
      console.log('token and user are present');
      navigate('/chat');
    }
  }, [curUser, getCurUserToken, navigate]);  // Runs only when curUser or getCurUserToken changes

  // 2. Handle Socket Initialization and Listeners
  useEffect(() => {
    console.log('useEffect in Chat.js for Handle Socket Initialization running')
    console.log('useEffect in Chat.js for Handle Socket Initialization token', token)
    const curUserToken = token;
    // const curUserToken = getCurUserToken(curUser);
    // console.log('useEffect in Chat.js for Handle Socket Initialization token getCurUserToken', curUserToken)
    if (!curUserToken) {
      console.log('no token in Handle Socket Initialization ')
      return}; // Do not initialize socket if no token

    // Initialize socket connection only if not already initialized
    if (!socketRef.current) {
      console.log('Initialize socket connection in useEffect in Chat.js');
      socketRef.current = io(API_BASE_URL, {
          query: {
            token: curUserToken
          }
      });

      // Remove old event listeners before adding new ones
      socketRef.current.removeAllListeners();

      // Handle incoming messages
      socketRef.current.on("new_message", (data) => {
        console.log('on new_message')
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      socketRef.current.on("user_joined", (data) => {
        console.log("on user_joined", data);
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      socketRef.current.on("user_left", (data) => {
        console.log("on user_left", data);
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      socketRef.current.on("auth_error", (err) => {
        console.log("in auth_err", err.msg)
        console.error(err);
        navigate("/login");
      });
    }else{
      console.log('Socket already initialized', socketRef.current);
    }


    // Cleanup function to disconnect socket and remove event listeners
    return () => {
      console.log("Chat.js unMounted");
      console.log('Disconnecting socket in useEffect in Chat.js');
      if (socketRef.current) {
        socketRef.current.removeAllListeners();  // Remove all event listeners
        socketRef.current.disconnect();  // Disconnect the socket
        socketRef.current = null;  // Clear the reference
      }
    };
  }, [curUser, getCurUserToken, navigate]);  // Runs when curUser or getCurUserToken changes

  useEffect(()=>{
      if(successMsg){
        console.log("Success message set, logout...");
        const timer = setTimeout(() => {
          console.log("Redirecting to /login...");
          navigate('/login')
        }, 1500);  // Wait 1.5 sec before redirecting
        return () => clearTimeout(timer);
      }

    }, [successMsg, navigate])

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socketRef.current) {
      socketRef.current.emit('message', { 'msg': message, 'username': curUser });
      console.log('set message')
      setMessage(""); // Clear the message input
    }
  };

  const handleLogout = () => {

    console.log('Logging out...');
    socketRef.current.disconnect();

    //Check if the socket is connected
    if (socketRef.current && socketRef.current.connected) {
        console.log('Socket is connected, disconnecting...');
        socketRef.current.disconnect();
    } else {
        console.log('Socket was already disconnected');
    }

    //Disable automatic reconnection after logout (if it's enabled)
    if (socketRef.current) {
        socketRef.current.io.opts.reconnection = false; // Disable reconnection
        socketRef.current.io.engine.close(); // Explicitly close the connection
    }

    // Set the success message
    // setSuccessMsg('Logging out...');

    // Call your logout functionality to clear user data and token
    logout(tabId);

    // After disconnecting, stop any further socket events from being emitted
    // if (!socketRef.current || !socketRef.current.connected) {
    //     console.log('Socket disconnected, skipping further socket actions');
    // }

    console.log('Logout complete');

  }

  return (
    <div>
      <h2>Chat</h2>
      <div style={{ border: "1px solid black", padding: "10px", height: "200px", overflowY: "scroll" }}>
        {messages.map((data, index) => {
          if (data.system) {
            return <strong key={index}><p>{data.msg}</p></strong>
          } else {
            return <p key={index}><strong>{data.username}</strong> says: {data.msg}</p>
          }
        })}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit" disabled={!message.trim()}>
          Send
        </button>
      </form>
      <button onClick={handleLogout}>Logout</button>

      {successMsg && <p style={{ color: 'green' }} aria-live="polite">{successMsg}</p>}
    </div>
  );
};

export default Chat;


