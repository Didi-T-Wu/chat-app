import AuthForm from "../ui/myUI/myForm";
import React, { useState, useCallback} from 'react';
import { ClipLoader } from "react-spinners";



const LoginForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({ username:'', password:'' })

  const onFormDataChange = useCallback((e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const onFormSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const onHandleCancel = () => {
    console.log("Cancel button clicked")
    setFormData({ username:'', password:'' })
  }

  // Define inputFields **outside** LoginForm so it's not re-created every render
const inputFields = [
  {
    label: "Username",
    type: "text",
    name: "username",
    onChange: onFormDataChange,
    value: formData.username,
    placeholder: "Type your username",
    autoComplete: "off",
    required: true,
    "aria-label": "Enter your username",
    w: "20rem",
  },
  {
    label: "Password",
    type: "password",
    name: "password",
    onChange: onFormDataChange,
    value: formData.password,
    placeholder: "Type your password",
    autoComplete: "off",
    required: true,
    "aria-label": "Enter your password",
    w: "20rem",
  },
];

const footerButtons = [
  {
    variant:"outline",
    buttonText: "Cancel",
    onClick: onHandleCancel,
    isDisabled: loading,
  },
  {
    variant: "solid",
    type: "submit",
    buttonText: loading ? <ClipLoader size={15} color="#ffffff" /> : "Login",
    color:"cyan.500",
    isDisabled: loading,
  },
]

  return (
    <AuthForm
      onSubmit={onFormSubmit}
      cardTitle="Login"
      cardDescription="Login to your account"
      inputFields={inputFields}
      footerButtons={footerButtons}
    />
  );
}
export default LoginForm
