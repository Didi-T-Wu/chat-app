import { Flex, Avatar, HStack, Stack, Text } from "@chakra-ui/react"

const Message = ({username, displayName, message, avatar, bgColor,textColor, timeStamp, alignMessageTo}) => {
    // TODO: randomly choose avatar color
    // TODO: timestamp for different locale
    // idea1: curUser doesn't show avatar
    // idea2: put avatar before the msg

    return(
        <Flex justify={alignMessageTo} >
          <Flex direction="column" gap="1" maxW='70%' p='2'>
            <Flex >
                <HStack key={username} gap="2">
                    <Avatar.Root size='2xs' variant='subtle' bg='pink'>
                        <Avatar.Fallback name={username} />
                        <Avatar.Image src={avatar} />
                    </Avatar.Root>
                    <Text textStyle="xs">{displayName}</Text>
                </HStack>
            </Flex>
            <Flex bg={bgColor} rounded="md" p='3' shadow='md'  justify={alignMessageTo}>
                <Text  textStyle="sm" color={textColor} >{message}</Text>
            </Flex>
            <Flex rounded="md" justify='flex-end'>
                <Text textStyle="xs" >{timeStamp}</Text>
            </Flex>
          </Flex>
        </Flex>

    )
}

export default Message