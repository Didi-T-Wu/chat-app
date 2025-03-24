import React, { useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { AuthContext } from "../context/AuthContext";
import Message from "./ui/myUI/myMessage";
// now I create room, room will be created, room name is number by ascending order
// leave room will leave curRoom and back to main
//TODO:  later, sidebar will show rooms with people there,
// by clicking it, user can join that room and leave current room
// not returning to main
const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null); // Store socket in state
  const navigate = useNavigate();
  const { curUser, tabId, logout, token } = useContext(AuthContext);

  ///////////////////////////////////////
  const [curRoom, setCurRoom] = useState('main')
  const [roomNum, setRoomNum] = useState(0)

  ///////////////////////////////////////

  // Handle Authentication (Token validation and Navigation)
  useEffect(() => {
    if (!token) {
      console.log('No token, redirecting to home...');
      navigate('/home');
    } else if (token && curUser) {
      console.log('Token and user are present, navigating to chat...');
      navigate('/chat');
    }
  }, [curUser, token, navigate]);

  // Handle Socket Initialization and Listeners
  useEffect(() => {
    if (!token) return; // No socket if no token

    console.log('Initializing socket connection...');
    const timeoutId = setTimeout(()=> {
     const newSocket = io(API_BASE_URL, { query: { token }});
     setSocket(newSocket); // Save socket instance to state

     newSocket.on('connect', () => {
      const sid = newSocket.id; // Get the WebSocket session ID
      console.log("Connected with SID:", sid);

      // store this `sid` in sessionStorage or state for later use
      sessionStorage.setItem('sid', sid);
    });

      newSocket.on("new_message", (data) => {
        console.log('on new_message');
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      newSocket.on("user_joined", (data) => {
        console.log("on user_joined", data);
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      newSocket.on("user_left", (data) => {
        console.log("on user_left", data);
        setMessages((prevMessages) => [...prevMessages, data]);
      });
////////////////////////////////////////
      newSocket.on("join_room", (data) => {
        console.log("on joined room", data);
        setMessages(() => [data]);

        setRoomNum(`${data.room}`)
        setCurRoom(`Room ${data.room}`)
      });

      newSocket.on("leave_room", (data) => {
        console.log("leave room back to main", data);
        setMessages(() => [data]);
        setCurRoom(()=> 'main')
      });
/////////////////////////////////////////////////
      newSocket.on("auth_error", (err) => {
        console.log("in auth_err", err.msg);
        console.error(err);
        navigate("/home");
      });

    return () => {
      console.log('Disconnecting socket on cleanup...');
      newSocket.disconnect();
      setSocket(null);
    }
  }, 500);
    return () => clearTimeout(timeoutId);
  }, [token]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socket) {
      socket.emit('message', { msg: message, username: curUser });
      setMessage("");
    }
  };

  const handleLogout = () => {
    console.log('Logging out...');
    logout(tabId, sessionStorage.getItem('sid'));
    console.log('socket',socket)
    if(socket){
      console.log('emit logout')
      // socket.emit('logout')
      setSocket(null)
    }
    navigate('/home')
    console.log('Logout complete');

  };

  ///////////////////
  const handleCreateAndJoinRoom = () => {
    console.log('create and join a room')
    //TODO: create a room name
    const newRoomNumber = Number(roomNum)+1
    socket.emit('join', {username:curUser, room:newRoomNumber})

  }

  const handleLeaveRoom = () => {
    console.log('leave a room, back to main')
    socket.emit('leave', {username:curUser, room:'main'})

  }
  /////////////////////

  return (
    <div>
      <h2>Room : {curRoom}</h2>
      <div style={{ border: "1px solid black", padding: "10px", height: "500px", overflowY: "scroll" }}>
        {messages.map((data, index) => (
          data.system ? (
            <strong key={index}><p style={{textAlign:"center"}}>{data.msg}</p></strong>
          ) : (
            data.username === curUser?(
             <Message
                username={curUser}
                message = {data.msg}
                bgColor='gray.100'
                textColor='black'
                alignMessageTo='flex-end'
                timeStamp={data.timeStamp}
              />
            ):(
              <Message
              username={data.username}
              message = {data.msg}
              bgColor='teal.300'
              textColor='while'
              alignMessageTo='flex-start'
              timeStamp={data.timeStamp}
            />

            )
          )
        ))}
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
      <br/>
      <button onClick={handleCreateAndJoinRoom}>Create Room</button>
      <br/>
      <button onClick={handleLeaveRoom}>Leave</button>
    </div>
  );
};

export default Chat;
