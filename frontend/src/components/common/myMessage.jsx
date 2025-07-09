import { Flex, Avatar, HStack, Stack, Text } from "@chakra-ui/react"

const Message = ({username, avatarBgColor, message, avatar, bgColor, textColor, timeStamp, alignMessageTo}) => {
    // TODO: timestamp for different locale

    return(
        <Flex justify={alignMessageTo} >
          <Flex direction="column" gap="1" maxW='70%' p='2'>
            <Flex >
                <HStack key={username} gap="4">
                    <Avatar.Root size='xs' variant='subtle' bg={avatarBgColor}>
                        <Avatar.Fallback name={username} />
                        <Avatar.Image src={avatar} />
                    </Avatar.Root>
                    <Stack gap="0">
                        <Text textStyle="xs"  >{username}</Text>
                    </Stack>
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