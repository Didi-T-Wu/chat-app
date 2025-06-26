import { Card, Stack } from "@chakra-ui/react"
import React from 'react';


const CardWithForm = ({cardTitle, cardDescription, inputFields, footerButtons}) => (
  <Card.Root maxW="sm">
    <Card.Header>
      <Card.Title fontWeight="bold" fontSize="20px">{cardTitle}</Card.Title>
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
       { footerButtons }
    </Card.Footer>
  </Card.Root>
)
export default CardWithForm