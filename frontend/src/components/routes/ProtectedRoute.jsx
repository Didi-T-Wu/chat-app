 import { useContext } from "react";
 import { AuthContext } from "../../context/AuthContext";
 import { Navigate } from 'react-router-dom';


 const ProtectedRoute = ({ children }) => {

    const { isAuthenticated } = useContext(AuthContext);
    console.log('in ProtectedRoute isAuthenticated', isAuthenticated)
    return isAuthenticated? children: <Navigate to="/login" replace />
 }

 export default ProtectedRoute