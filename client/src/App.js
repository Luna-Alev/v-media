import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import UserContext from "./UserContext";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import PostForm from "./components/PostForm";
import PostFeed from "./components/PostFeed";
import VerifyEmail from "./components/VerifyEmail";
import RequestResetPassword from "./components/ResetPasswordRequest";
import ResetPassword from "./components/ResetPassword";
import EditProfile from "./components/EditProfile";
import Chat from "./components/Chat";
import Navbar from "./components/Navbar";
import "./App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userID, setUserID] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setIsAuthenticated(true);
      const decodedToken = jwtDecode(storedToken);
      setUserID(decodedToken.id);
      setUsername(decodedToken.username);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <UserContext.Provider value={{ isAuthenticated, setIsAuthenticated, userID, setUserID, username}}>
    <Router>
      <Navbar/>

      <Routes>
        <Route path="/" element={<PostFeed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/createpost" element={<PostForm />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/request-reset-password" element={<RequestResetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/chat/:recipient" element={<Chat />} />
      </Routes>
    </Router>
    </UserContext.Provider>
  );
};

export default App;
