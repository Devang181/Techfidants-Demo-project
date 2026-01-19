import React from "react";
import { useSelector } from "react-redux";
import Login from "../pages/login";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useSelector((state) => state.auth);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not logged in, show login page
  if (!isLoggedIn) {
    return <Login />;
  }

  
  return <>{children}</>;
};

export default ProtectedRoute;

