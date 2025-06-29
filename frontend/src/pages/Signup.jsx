import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from 'react-router-dom'
import { Flex, Link as ChakraLink, Text, Box } from "@chakra-ui/react"

import { API_BASE_URL } from '../config';
import { AuthContext } from '../context/AuthContext';

import SignupForm from "../components/auth/SignupForm";
import BackGroundImage from "../components/BackGroundImage";
import Alert from "../components/ui/myUI/myAlert"


const Signup = ()=> {
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { authenticate } = useContext(AuthContext)

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => {
        setErrorMsg('');
      }, 5000); // Clear error after 5 seconds

      return () => clearTimeout(timer); // Clean up the timer on component unmount
    }
  }, [errorMsg]);


  const onHandleSubmit= async (formData)=> {

    // Prevent submission if fields are empty
    if (!formData.username.trim() || !formData.password.trim()) {
      setErrorMsg("Username and password are required");
      return;
    }

    console.log("Signup Data:", formData);
    setLoading(true);
    setErrorMsg('');

    try{
      const response =  await fetch(`${API_BASE_URL}/api/signup`, {
        method:"POST",
        headers:{ "Content-Type": "application/json" },
        body:JSON.stringify(formData)
      })

      if(!response.ok){
        const errorData = await response.json();
        switch(response.status){
          case 400:
            throw new Error(errorData.msg || "Invalid input. Please check your details and try again.");
          case 404:
            throw new Error("Server not found. Please try again later.")
          case 500:
            throw new Error("Internal server error. Please try again in a few minutes.");
          default:
            throw new Error("An unexpected error occurred. Please try again.");
      }}

      const data = await response.json()
      console.log(data.msg)
      console.log('data received from backend in Signup.js', data)
      authenticate(data.username, data.token)
      setSuccessMsg("Sign up successful! Redirecting...");
      setTimeout(() => navigate('/chat'), 1500);  // Wait 1.5 sec before redirecting

    }catch(err){
      if (err.message.includes("Failed to fetch")) {
        setErrorMsg("Network error. Check your internet connection and try again.");
      } else {
        setErrorMsg(err.message);
      }
    } finally{
      setLoading(false);
    }
  }

  return(
    <Flex justify="center" align="center" h="100vh" direction="column" position="relative">
      <Box>
        <SignupForm onSubmit={onHandleSubmit} loading={loading} />
        <Box mt={2}>
          {errorMsg && <Alert title={errorMsg} status="error" />}
          {successMsg && <Alert title={successMsg} status="success" />}
        </Box>
      </Box>
      <br/>
      <Text fontWeight="bold">Already have an account ? {" "}{" "}
        <ChakraLink asChild variant="underline" color="blue.800">
          <Link to='/login'>To Login Page</Link>
        </ChakraLink>{" "}
      </Text>
      <BackGroundImage />

    </Flex>
  )
}

export default Signup;