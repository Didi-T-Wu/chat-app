import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom"
import { Flex, Link as ChakraLink, Text, Box} from "@chakra-ui/react"

import { API_BASE_URL } from "../config";
import { AuthContext } from "../context/AuthContext";

import LoginForm from "../components/auth/LoginForm";
import BackGroundImage from "../components/layout/BackGroundImage";
import Alert from "../components/common/myAlert"


const Login = ()=> {
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { authenticate, token } = useContext(AuthContext)

  console.log('Login component rendering');

  useEffect(() => {
      console.log('token in useEffect in Login.js', token);

      if(token){
        console.log('token is present');
        navigate("/chat");
      }
    }, [token, navigate]);

  useEffect(() => {
    console.log('errorMsg in useEffect in Login.js', errorMsg);
    if (errorMsg) {
      console.log("Error message set");
      const timer = setTimeout(() => {
        setErrorMsg("");
      }, 5000); // Clear error after 5 seconds

      return () => clearTimeout(timer); // Clean up the timer on component unmount
    }
  }, [errorMsg]);


  const onHandleSubmit = async (formData)=> {

    if (!formData.username.trim() || !formData.password.trim()) {
      setErrorMsg("Username and password are required");
      return;
    }

    console.log("Login Data:", formData);
    setLoading(true);
    setErrorMsg("");

    try{
      const response =  await fetch(`${API_BASE_URL}/api/login`, {
        method:"POST",
        headers:{ "Content-Type": "application/json" },
        body:JSON.stringify(formData)
      })

      if(!response.ok){
        const errorData = await response.json();
        switch(response.status){
          case 401:
            throw new Error(errorData.msg || "Invalid credentials")
          case 400:
            throw new Error(errorData.msg || "Invalid input. Please check your details and try again.")
          case 404:
            throw new Error("Server not found. Please try again later.")
          case 500:
            throw new Error("Internal server error. Please try again in a few minutes.");
          default:
            throw new Error("An unexpected error occurred. Please try again.");
      }}

      const data = await response.json()
      console.log('successful logging msg in Login from backend',data.msg)

      // Get token and username from backend then login(using login function in auth context)
      if (data?.username && data?.token) {
        authenticate(data.username, data.token);
      } else {
        // Log the error for monitoring, but avoid exposing sensitive data in production
        console.error("Missing username or token",
          { username: data?.username ? 'Present' : 'Missing', token: data?.token ? 'Present' : 'Missing' });

        setErrorMsg("An error occurred. Please try logging in again.");

      }
      setSuccessMsg("Login successful! Redirecting...");
      setTimeout(() => navigate("/chat"), 5000);

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
    <Flex justify="center" align="center" h="100vh" direction="column" position="relative"  >
      <Box >
        <LoginForm onSubmit={onHandleSubmit} loading={loading}   />
        <Box mt={2}>
          {errorMsg && <Alert title={errorMsg} status="error" />}
          {successMsg && <Alert title={successMsg} status="success" />}
        </Box>
      </Box>
      <br/>
      <Text fontWeight="bold">Do not have an account ? {" "}{" "}
        <ChakraLink asChild variant="underline" color="blue.800">
          <Link to="/signup">Create an Account</Link>
        </ChakraLink>{" "}
      </Text>
      <BackGroundImage />
    </Flex>
  )
}

export default Login;
