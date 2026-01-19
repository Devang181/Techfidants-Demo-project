import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./store/authSlice";
import ProtectedRoute from "./components/ProtectedRoute";

import UserRole from "./pages/userRole";
import Addroll from "./pages/Addroll";
import Budget from "./pages/Budget";
import Header from "./pages/Header";

const App = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);

  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem("currentPage") || "userRole"
  );

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <ProtectedRoute>
      <Header
        userData={userData}
        onLogout={handleLogout}
        onNavigateToRoll={() => {
          setCurrentPage("userRole");
          localStorage.setItem("currentPage", "userRole");
        }}
        onNavigateToBudget={() => {
          setCurrentPage("budget");
          localStorage.setItem("currentPage", "budget");
        }}
      />

      {currentPage === "addroll" ? (
        <Addroll
          onBack={() => {
            setCurrentPage("userRole");
            localStorage.setItem("currentPage", "userRole");
          }}
        />
      ) : currentPage === "budget" ? (
        <Budget />
      ) : (
        <UserRole
          userData={userData}
          onNavigateToAddRole={() => {
            setCurrentPage("addroll");
            localStorage.setItem("currentPage", "addroll");
          }}
        />
      )}
    </ProtectedRoute>
  );
};

export default App;
