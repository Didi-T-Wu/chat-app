import { Icon } from "@chakra-ui/react"
import { BsSend } from "react-icons/bs";
import { IoIosLogOut } from "react-icons/io";

export const  BsSendIcon = () => (
  <Icon size="lg" color="gray.100" >
    < BsSend />
  </Icon>
)

export const IoIosLogOutIcon = () => (
  <Icon size="md" color="gray.100" bg="gray.800">
    < IoIosLogOut />
  </Icon>
)
