import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHotel, faUser, faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";

const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navContainer">

        {/* Logo */}
        <Link to="/" className="navLogo">
          <div className="logoIcon">
            <FontAwesomeIcon icon={faHotel} />
          </div>

          <div className="logoText">
            <span className="logoMain">Urban</span>
            <span className="logoSub">LODGINGS</span>
          </div>
        </Link>

        {/* Right side */}
        <div className="navItems">

          {user ? (
            <>
              <div className="userProfile">
                <div className="userIcon">
                  <FontAwesomeIcon icon={faUser} />
                </div>

                <div className="userInfo">
                  <span className="welcomeText">Welcome back</span>
                  <span className="username">{user.username}</span>
                </div>
              </div>

              <button
                className="navButton logoutButton"
                onClick={handleLogout}
              >
                <FontAwesomeIcon icon={faArrowRightFromBracket} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="navLink">
                Register
              </Link>

              <Link to="/login" className="loginButton">
                Login
              </Link>
            </>
          )}

        </div>

      </div>
    </nav>
  );
};

export default Navbar;