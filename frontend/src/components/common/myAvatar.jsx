import { Avatar, HStack, Stack, Text } from "@chakra-ui/react"

const myAvatar = ({curUser}) => {
    return (
          <HStack key={curUser.username} gap="4" mb={4}>
            <Avatar.Root bg={curUser.avatarBgColor}>
              <Avatar.Fallback name={curUser.username} />
            </Avatar.Root>
            <Stack gap="0">
              <Text fontWeight="medium">{curUser.username}</Text>
            </Stack>
          </HStack>

    )
  }

export default myAvatar