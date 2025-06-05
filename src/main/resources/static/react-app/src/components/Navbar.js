import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

function Navbar({ isAuthenticated, user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Pet Mart</Link>
      </div>
      <div className="navbar-menu">
        {isAuthenticated ? (
          <>
            <Link to="/productList" className="navbar-item">
              Products
            </Link>
            <Link to="/shoppingCart" className="navbar-item">
              Cart
            </Link>
            {user?.authorities?.some(
              (auth) => auth.authority === "ROLE_ADMIN"
            ) && (
              <Link to="/admin/product" className="navbar-item">
                Admin
              </Link>
            )}
            <button onClick={handleLogout} className="navbar-item button-link">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="navbar-item">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
