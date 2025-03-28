import React, { useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { AuthContext } from "../context/AuthContext";
import Message from "./ui/myUI/myMessage";
import Profile from "./ui/myUI/myProfile";
import { Flex, Box, Button, VStack, Text, Input, Textarea, Float, IconButton, Circle} from "@chakra-ui/react";
import { MdMeetingRoom } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { BsSend } from "react-icons/bs";

// now I create room, room will be created, room name is number by ascending order
// leave room will leave curRoom and back to main
//TODO:  later, sidebar will show rooms with people there,
// by clicking it, user can join that room and leave current room
// not returning to main
const Chat = () => {
  const [message, setMessage] = useState("");

  const [socket, setSocket] = useState(null); // Store socket in state
  const navigate = useNavigate();
  const { curUser, tabId, logout, token } = useContext(AuthContext);

  ///////////////////////////////////////
  const DefaultRoom = 'main'
  const [curRoom, setCurRoom] = useState(sessionStorage.getItem('curRoom') ||  DefaultRoom)
  const [activeRooms, setActiveRooms] = useState([])
  const [messages, setMessages] = useState(() => {
    return JSON.parse(sessionStorage.getItem("messages")) || [];
  });

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
        console.log('messages from new_message',messages)
        console.log('messages after adding  new message', [...messages, data])
        const messagesForStorage = [...messages, data]
        sessionStorage.setItem('messages', JSON.stringify( messagesForStorage))
        setMessages((prevMessages) => [...prevMessages, data]);

      });

      newSocket.on("user_joined", (data) => {
        console.log("on user_joined", data);
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      newSocket.on("user_left", (data) => {
        console.log("on user_left", data);
        newSocket.emit('manually_clean_up_user_in_room', { username:curUser, room:curRoom })
        newSocket.emit('update')
        setMessages((prevMessages) => [...prevMessages, data]);

      });
////////////////////////////////////////
      newSocket.on("join_room", (data) => {
        console.log("on joined room", data);
        // if room == main, broadcast to all
        // otherwise to room
        // clear prev messages
        sessionStorage.setItem('curRoom', data.room)
        setMessages((prevMessages) => [...prevMessages, data]);
        setCurRoom(data.room)
      });

      newSocket.on("leave_room", (data) => {
        console.log("on leave room", data);
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      newSocket.on('update_rooms', (data)=>{
        console.log("on update rooms", data);
        setActiveRooms(data.rooms)

      })
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
      socket.emit('message', { msg: message, username: curUser, room:curRoom });
      setMessage("");
    }
  };

  const handleLogout = () => {
    console.log('Logging out...');
    logout(tabId, sessionStorage.getItem('sid'));
    socket.emit('leave', { username:curUser, room:curRoom })
    socket.emit('update')
    console.log('socket',socket)
    if(socket){
      console.log('emit logout')
      // socket.emit('logout')
      // setSocket(null)
    }
    sessionStorage.setItem('curRoom','')
    sessionStorage.setItem('messages',JSON.stringify([]))
    navigate('/home')
    console.log('Logout complete');

  };

  ///////////////////
  const handleCreateAndJoinRoom = () => {
    console.log('create and join a room')
    //TODO: user can create a room name
    // increment room number
    // enter new room and leave current room


    socket.emit('leave', { username:curUser, room:curRoom})
    socket.emit('join', { username:curUser, room:''})
    socket.emit('update')


  }

  const handleLeaveRoom = () => {
    console.log('leave a room, back to main')
    socket.emit('leave', {username:curUser, room:curRoom})
    socket.emit('join', { username:curUser, room: DefaultRoom})
    socket.emit('update')

  }

  const handleSwitchRoom= (room) => {
    console.log('leave current room to other room')
    socket.emit('leave', {username:curUser, room:curRoom})
    socket.emit('join', { username:curUser, room:room})
    socket.emit('update')

  }
  /////////////////////
  const renderMessage = (data, index, curRoom, curUser) =>{
    console.log('renderMessage called')

    if(data.room !== curRoom) return;

    if(data.system){
      return (<strong key={index}><p style={{textAlign:"center"}}>{data.msg}</p></strong>)
    }

    return (<Message
                key={index}
                username={data.username === curUser? curUser: data.username}
                displayName={data.username === curUser? "you": data.username}
                message = {data.msg}
                bgColor={data.username === curUser?'gray.100':'teal.300'}
                textColor={data.username === curUser?'black':'black'}
                alignMessageTo={data.username === curUser?'flex-end':'flex-start'}
                timeStamp={data.timeStamp}
            />)
  }

  const renderMessages = (messages, curRoom, curUser) => {
    console.log('renderMessages called')
    return messages.map((data, index)=> (renderMessage(data, index, curRoom,curUser)))
  }

  const renderRooms = (activeRooms) => {
    return activeRooms.map((room, index) => {
      return (
        <Button key={index} onClick={()=> handleSwitchRoom(room)}>
            <MdMeetingRoom/>{room}
        </Button>)
    })
  }

  ///////

  return (
    <div >
      <Flex p="5" h="80%" gap="5">
        <Flex direction="column" gap="4"  w="40lvh" justify="space-between">
          <Button onClick={handleLogout}>Logout</Button>
          <Profile username={curUser}/>
          <Flex direction="column">
            {renderRooms(activeRooms)}
          </Flex>
          <Button onClick={handleCreateAndJoinRoom}>Create Room</Button>
        </Flex>
        <Flex
            direction="column"
            w="60lvh"
            bgGradient="to-r"
            gradientFrom="yellow.100"
            gradientTo="blue.100"
            rounded="xl"
        >
          <Flex justify="flex-end" >
            <Box
              bg='teal'
              width="100%"
            >
               <Text textAlign="center">{curRoom}</Text>
            </Box>
            <Button onClick={handleLeaveRoom}>Leave</Button>
          </Flex>
          <Box
            height="600px"
            overflowY= "scroll"
          >
            {renderMessages(messages, curRoom, curUser)}
          </Box>
          <form onSubmit={sendMessage}>
              <Box position="relative">
                <Input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  variant="subtle"
                  rounded="xl"
                />
                <Float offsetY="5" offsetX="6">
                  <IconButton
                    aria-label="send message"
                    type="submit"
                    size="xs"
                    variant="subtle"
                    bg="blue.200"
                    rounded="xl"
                    disabled={!message.trim()}
                  >
                    <BsSend />
                  </IconButton>
                </Float>
               </Box>
          </form>
        </Flex>
      </Flex>
    </div>
  );
};

export default Chat;
