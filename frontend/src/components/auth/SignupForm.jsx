import { nyForm as AuthForm } from "../ui/myUI/myForm";
import React from 'react';

const SignupForm = ({onSubmit}) => {
  return (
    <AuthForm
      onSubmit={onSubmit}
      cardTitle="Sign Up"
      cardDescription="Sign up to create an account"
      inputFields={[
        { label: "Username", type: "text", name: "username" },
        { label: "Password", type: "password", name: "password" },
      ]}
      footerButtons={[
        { buttonText: "Sign Up", type: "submit" },
      ]}
    />
  );
}
export default SignupForm

