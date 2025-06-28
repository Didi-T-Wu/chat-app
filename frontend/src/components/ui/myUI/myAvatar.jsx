import { Avatar, HStack, Stack, Text } from "@chakra-ui/react"

const myAvatar = ({user}) => {
    return (
          <HStack key={user.email} gap="4">
            <Avatar.Root>
              <Avatar.Fallback name={user.name} />
              <Avatar.Image src={user.avatar} />
            </Avatar.Root>
            <Stack gap="0">
              <Text fontWeight="medium">{user.name}</Text>
              <Text color="fg.muted" textStyle="sm">
                {user.email}
              </Text>
            </Stack>
          </HStack>

    )
  }

export default myAvatar