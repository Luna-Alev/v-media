import React, { useContext } from 'react';
import UserContext from '../UserContext';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import './Navbar.css';

const Navbar = () => {
    const { isAuthenticated, setIsAuthenticated, username } = useContext(UserContext);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      };

    return (
    <nav>
    <Link to="/" className="logo">LOGO</Link>
    <Link to="/" className="title">Name</Link>
    <div className="auth-links">
      <ul>
        {isAuthenticated ? (
          <>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
            <li>
              <Link to="/createpost">Create Post</Link>
            </li>
            <li>
              <Link to={`/profile/${username}`}>Profile</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </div>
</nav>

    )
};

export default Navbar;