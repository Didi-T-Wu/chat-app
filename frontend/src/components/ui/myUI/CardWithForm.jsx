import { Button, Card, Stack } from "@chakra-ui/react"


export const CardWithForm = ({cardTitle, cardDescription, inputFields}) => (
  <Card.Root maxW="sm">
    <Card.Header>
      <Card.Title>{cardTitle}</Card.Title>
      <Card.Description>
        {cardDescription}
      </Card.Description>
    </Card.Header>
    <Card.Body>
      <Stack gap="4" w="full">
       { inputFields }
      </Stack>
    </Card.Body>
    <Card.Footer justifyContent="flex-end">
      <Button variant="outline">Cancel</Button>
      <Button variant="solid">Sign in</Button>
    </Card.Footer>
  </Card.Root>
)
