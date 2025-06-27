import React, { useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { AuthContext } from "../context/AuthContext";
import Message from "./ui/myUI/myMessage";
import { Grid, GridItem, Box, Input, Text, Button} from "@chakra-ui/react"
import  { BsSendIcon } from "../theme/icons"

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null); // Store socket in state
  const navigate = useNavigate();
  const { curUser, tabId, logout, token } = useContext(AuthContext);

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
    // FIXME: error showed after logout
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

  const renderMsgBox = () => {
    return (
      <Box position="relative" h="80vh" display="flex" flexDirection="column">
        {/* Messages Container */}
        <Box flex="1" borderWidth="1px" borderColor="gray.600" rounded="md" overflowY="auto" p={2}>
          {messages.map((data, index) => (
            data.system ? (
              <Text key={index} textAlign="center" fontWeight="bold">{data.msg}</Text>
            ) : (
              data.username === curUser?(
               <Message
                  key={index}
                  username={curUser}
                  message = {data.msg}
                  bgColor="teal.600"
                  textColor="white"
                  alignMessageTo="flex-end"
                  timeStamp={data.timeStamp}
                />
              ):(
                <Message
                key={index}
                username={data.username}
                message = {data.msg}
                bgColor="gray.600"
                textColor="white"
                alignMessageTo="flex-start"
                timeStamp={data.timeStamp}
              />

              )
            )
          ))}
          </Box>
          {/* Input Form */}
          <Box
            as="form"
            onSubmit={sendMessage}
            display="flex"
            alignItems="center"
            gap={2}
            borderColor="gray.600"
            paddingTop={2}
            >
              <Input
                flex="1"
                borderColor="gray.600"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                color="white"
              />
            <Button type="submit" disabled={!message.trim()} >
              <BsSendIcon />
            </Button>
          </Box>
      </Box>
    )
  }

  return (
    <Grid
      p={8}
      gap={4}
      bgColor="gray.800"
      color="gray.300"
      h="100vh"
      templateRows="repeat(20, 1fr)"
      templateColumns="repeat(7, 1fr)">

      <GridItem rowSpan={3} colSpan={2}>
        <Box>
          avatar
          <button onClick={handleLogout}>Logout</button>
        </Box>
      </GridItem>
      <GridItem rowSpan={3} colSpan={5}>
        <Box>active users</Box>
      </GridItem>
      <GridItem rowSpan={17} colSpan={2}>
        <Box>registered users</Box>
      </GridItem>
      <GridItem rowSpan={17} colSpan={5}>
        { renderMsgBox()}
      </GridItem>
    </Grid>
  );
};

export default Chat;
