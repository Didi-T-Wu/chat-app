import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'


import Chat from './components/Chat'
import Signup from './pages/Signup'
import Home from './components/Home'
import Login from './pages/Login'

function App() {
  return (
    <div className="App">
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