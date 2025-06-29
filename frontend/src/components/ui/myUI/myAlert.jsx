import { Alert } from "@chakra-ui/react"

const myAlert = ({status, title})=> {

    return (
      <Alert.Root status={status}>
        <Alert.Indicator />
        <Alert.Title >{title}</Alert.Title>
      </Alert.Root>
    )
}
export default myAlert

// TODO: aria-live="assertive" aria-live="polite"

