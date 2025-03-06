import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { Provider as CSSProvider} from "./components/ui/provider"

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <CSSProvider>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
   </CSSProvider>
  </StrictMode>,
)
