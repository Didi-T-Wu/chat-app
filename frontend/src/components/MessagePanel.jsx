import Message from "./ui/myUI/myMessage";
import { Box, Input, Text, Button } from "@chakra-ui/react"
import { BsSendIcon } from "../theme/icons"


const MessagePanel = ({ message, messages, curUser, sendMessage, setMessage}) => {
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

export default MessagePanel ;
