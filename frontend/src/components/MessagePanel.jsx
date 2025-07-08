import Message from "./ui/myUI/myMessage";
import { Box, Input, Text, Button } from "@chakra-ui/react"
import { BsSendIcon } from "../theme/icons"
import { generateColorFromUsername } from "../helperFunctions";

// TODO: add avatarBgColor for other users: put helper function to a file
const MessagePanel = ({ message, messages, curUser, sendMessage, setMessage}) => {
    return (
      <Box position="relative" h="80vh" display="flex" flexDirection="column">
        {/* Messages Container */}
        <Box flex="1" borderWidth="1px" borderColor="gray.600" rounded="md" overflowY="auto" p={2}>
          {messages.map((data, index) => (
            data.system ? (
              <Text key={index} textAlign="center" fontWeight="bold">{data.msg}</Text>
            ) : (
              data.username === curUser.username?(
               <Message
                  key={index}
                  username={curUser.username}
                  avatarBgColor={curUser.avatarBgColor}
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
                avatarBgColor={generateColorFromUsername(data.username)}
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

export default MessagePanel ;
