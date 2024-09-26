import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import UserContext from "./UserContext";
import Register from "./components/Register";
import Login from "./components/Login";
import PostForm from "./components/PostForm";
import PostFeed from "./components/PostFeed";
import "./App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setIsAuthenticated(true);
      const decodedToken = jwtDecode(storedToken);
      setUserID(decodedToken.id);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <UserContext.Provider value={{ isAuthenticated, setIsAuthenticated, userID, setUserID}}>
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>

          {isAuthenticated ? (
            <div>
            <li>
              <button
                onClick={handleLogout}>
                Logout
              </button>
            </li>
            <li>
              <Link to="/createpost">Create Post</Link>
            </li>
            </div>
          ) : (
          <div>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
          </div>
          )}
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<PostFeed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/createpost" element={<PostForm />} />
      </Routes>
    </Router>
    </UserContext.Provider>
  );
};

export default App;
