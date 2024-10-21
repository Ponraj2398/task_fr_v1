import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');  // Check if user is authenticated
  
  // If authenticated, render the passed component (element), otherwise redirect to login page
  return isAuthenticated ? element : <Navigate to="/" />;
};

export default PrivateRoute;
