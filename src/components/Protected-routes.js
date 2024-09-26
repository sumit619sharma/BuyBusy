import React from 'react'
import { useSelector } from 'react-redux'
import { authSelector } from '../redux/reducers/auth-reducer'
import { Navigate } from 'react-router-dom';

const ProtectedRoutes = ({children}) => {
 const {userDetails: user}= useSelector(authSelector);

 if(!user) {
    return  <Navigate to="/" />
 }
    return (
        <div>
        {children}
        </div>
  )
}

export default ProtectedRoutes