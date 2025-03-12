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
  const { curUser, getCurUserToken, logout } = useContext(AuthContext);

  // 1. Handle Authentication (Token validation and Navigation)
  useEffect(() => {
    console.count("Effect triggered")
    const curUserToken = getCurUserToken(curUser);
    console.log('token from localStorage in useEffect in Chat.js', curUserToken);

    if (!curUserToken) {
      console.log('no token');
      navigate('/login'); // Redirect to login if token is missing
    }
  }, [curUser, getCurUserToken, navigate]);  // Runs only when curUser or getCurUserToken changes

  // 2. Handle Socket Initialization and Listeners
  useEffect(() => {
    console.log("Chat.js Mounted");
    const curUserToken = getCurUserToken(curUser);
    if (!curUserToken) return; // Do not initialize socket if no token

    // Initialize socket connection only if not already initialized
    if (!socketRef.current) {
      console.log('Initialize socket connection in useEffect in Chat.js');
      socketRef.current = io(API_BASE_URL, { query: { token: curUserToken } });

      // Remove old event listeners before adding new ones
      socketRef.current.removeAllListeners();

      // Handle incoming messages
      socketRef.current.on("new_message", (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      socketRef.current.on("user_joined", (data) => {
        console.log("Received data:", data);
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      socketRef.current.on("user_left", (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      socketRef.current.on("auth_error", (err) => {
        console.error(err);
        navigate("/login");
      });
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
      setMessage(""); // Clear the message input
    }
  };

  const handleLogout = () => {
    console.log(`Logging out ${curUser} in Chat.js`);
    setSuccessMsg('Logging out...');
    logout(curUser);
    socketRef.current.disconnect();  // This will properly disconnect the socket
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


