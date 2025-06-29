import { Card, Stack } from "@chakra-ui/react"
import React from 'react';
import InputField from "./InputField";
import Button from "./myButton"


const CardWithForm = ({cardTitle, cardDescription, inputFieldProps, footerButtonProps}) => (
  <Card.Root maxW="sm">
    <Card.Header>
      <Card.Title fontWeight="bold" fontSize="20px">{cardTitle}</Card.Title>
      <Card.Description>
        {cardDescription}
      </Card.Description>
    </Card.Header>
    <Card.Body>
      <Stack gap="4" w="20rem">
       { inputFieldProps.map((fieldProps, index) => (
        <InputField key={fieldProps.name || index} {...fieldProps} />
       )) }
      </Stack>
    </Card.Body>
    <Card.Footer justifyContent="flex-end">
       { footerButtonProps.map((buttonProps, index) => (
        <Button key={buttonProps.buttonText || index} {...buttonProps}/> )) }
    </Card.Footer>
  </Card.Root>
)
export default CardWithForm