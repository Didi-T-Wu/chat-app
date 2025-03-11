// import { Button, Card, Stack } from "@chakra-ui/react"
import CardWithForm  from "./CardWithForm";
import  InputField  from "./inputField";
import Button  from "./myButton";
import React from 'react';

const myForm = ({onSubmit, cardTitle, cardDescription, inputFields, footerButtons}) => {
  return (
  <form onSubmit = { onSubmit } >
    <CardWithForm
      cardTitle= { cardTitle}
      cardDescription= { cardDescription }
      inputFields={ inputFields.map((field, index) => (
        <InputField key={field.name||index} {...field} />
      ))}
      footerButtons={ footerButtons.map((button, index) => (
        <Button key={button.buttonText||index} {...button
        } />
      ))}
    />
  </form>)}


export default myForm
