// import { Button, Card, Stack } from "@chakra-ui/react"
import InputField from "../ui/myUI/inputField"
import { CardWithForm } from "../ui/myUI/CardWithForm";

export const AuthForm = () => (
  <form>
    <CardWithForm
      cardTitle="Sign In"
      cardDescription="Please enter your credentials"
      inputFields={
          <>
            <InputField label="Username" type='text' />
            <InputField label="Password" type="password" />
          </>
      }
    />
  </form>
)
