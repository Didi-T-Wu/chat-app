import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Chat from './pages/ChatPage'
import Signup from './pages/Signup'
import Login from './pages/Login'
import ProtectedRoute from './components/routes/ProtectedRoute'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/chat" element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
          } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  )
}

export default App