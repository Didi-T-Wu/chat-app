import { Text, Image, Flex } from "@chakra-ui/react"
import defaultAvatar from "../../../assets/default-avatar-image.png"

const MyProfile = ({username}) => {
    // TODO: randomly choose avatar color
    // TODO: timestamp for different locale

    return(
        <Flex direction="column" gap="4"  align="center">
            <Image
                rounded="md"
                src={defaultAvatar}
                alt="Default Avatar"
                w='60%'
            />
            <Text textStyle="2xl" alignSelf="flex-start">{username}</Text>
        </Flex>
    )
}
export default MyProfile