import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'


import Chat from './components/Chat'
// import Login from './components/Login'
import Signup from './components/Signup'
import Home from './components/Home'
import Login from './pages/Login'

function App() {
  return (
    <div className="App" tabIndex="-1" >
      <h1>React + Flask SocketIO</h1>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  )
}

export default App