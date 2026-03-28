import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          <span className="logo">Urban Lodgings</span>
        </Link>

        {user ? (
          <div className="navItems">
            <span
      className="welcomeMessage"
      style={{
        fontWeight: "bold",
        color: "#fff",
        marginLeft: "30px",
        fontSize: "19px",
      }}
    >
      Welcome!{" "}
    </span>
    <span
      className="username"
      style={{
        fontWeight: "bold",
        color: "#fff",
        marginLeft: "3px",
        fontSize: "19px"
      }}
    >
      {user.username}
    </span>
            <button className="navButton" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="navItems">
            <Link to="/register">
              <button className="navButton">Register</button>
            </Link>
            <Link to="/login">
              <button className="navButton">Login</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
