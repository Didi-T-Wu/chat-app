import { Flex, Avatar, HStack, Stack, Text } from "@chakra-ui/react"

const Message = ({user, bgColor,textColor}) => {
    // TODO: randomly choose avatar color

    return(
        <Flex direction="column" gap="1" w='50%' p='2'>
          <Flex >
            <HStack key={user.username} gap="4">
                <Avatar.Root size='xs' variant='subtle' bg='pink'>
                    <Avatar.Fallback name={user.username} />
                    <Avatar.Image src={user.avatar} />
                </Avatar.Root>
                <Stack gap="0">
                    <Text textStyle="xs"  >{user.username}</Text>
                </Stack>
            </HStack>
          </Flex>
          <Flex bg={bgColor} rounded="md" p='3' shadow='md'>
                <Text  textStyle="sm" color={textColor}>{user.message}</Text>
          </Flex>
          <Flex  rounded="md" justify='flex-end'> <Text textStyle="xs" >{user.time}</Text></Flex>
        </Flex>

    )
}

export default Message