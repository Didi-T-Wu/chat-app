import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import { Grid, GridItem, Box, Button, Flex} from "@chakra-ui/react"
import  { IoIosLogOutIcon } from "../theme/icons"
import MyAvatar from "../components/common/myAvatar";

import useSocket from "../hooks/useSocket";
import MessagePanel from "../components/chat/MessagePanel";

// 20250703
import FetchWithAuth from "../components/chat/FetchWithAuth";

//20250708
import { generateColorFromUsername } from "../utils/helperFunctions"

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  const { curUser, logout, token } = useContext(AuthContext);

  //02050707
  const [activeUsers, setActiveUsers] = useState([])

  // Handle Socket Initialization and Listeners
  const messageHandlers = {
    newMessage: (data) => {
        console.log('on new_message');
        setMessages((prevMessages) => [...prevMessages, data])
    },
    userJoined: (data) => {
        console.log("on user_joined", data);
        setMessages((prevMessages) => [...prevMessages, data]);
    },
    userLeft: (data) => {
        console.log("on user_left", data);
        setMessages((prevMessages) => [...prevMessages, data]);

    },
    getActiveUsers:(data) => {
      console.log("on get_active_users", data);
      setActiveUsers(data['active_users'])
    },
    authError: (err) => {
        console.log("in auth_err", err.msg);
        console.error(err);
        navigate("/login");
    }}

  const socket = useSocket(token, messageHandlers)

  // Handle Authentication (Token validation and Navigation)
  useEffect(() => {
    const fetchProtectedData = async () => {

      console.log("inside fetchProtectedData in chat.jsx ")
      const res = await FetchWithAuth("/api/protected", navigate)
      const data = await res.json();
      console.log(data)
    }
    fetchProtectedData()
  }, [navigate]);


  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socket) {
      console.log('send message')
      socket.emit("message", { msg: message, username: curUser.username });
      setMessage("");
    }
  };

  const handleLogout = () => {
    if(socket && socket.connected){
      console.log('emit logout')
      socket.disconnect();
    }
    console.log('Logging out...');
    logout();
    navigate("/login")
  };


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
        <Flex justify="space-between">
          <MyAvatar  curUser={curUser} />
          <Button onClick={handleLogout} bg="gray.800">
            <IoIosLogOutIcon />
          </Button>
        </Flex>
      </GridItem>
      <GridItem rowSpan={3} colSpan={5} >
        <Flex justify="center" fontSize={48}>messages</Flex>
      </GridItem>
      <GridItem rowSpan={17} colSpan={2}>
        <Box>
         {activeUsers.map((activeUser,index) => <MyAvatar key={index} curUser={{username:activeUser, avatarBgColor:generateColorFromUsername(activeUser)}}/>)}
        </Box>
      </GridItem>
      <GridItem rowSpan={17} colSpan={5}>
        <MessagePanel message={message} messages={messages} curUser={curUser} sendMessage={sendMessage} setMessage={setMessage}/>
      </GridItem>
    </Grid>
  );
};

export default Chat;
