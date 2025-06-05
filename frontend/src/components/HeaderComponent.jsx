import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { cartService } from "../services/cartService";
import {
  getCurrentUser,
  logout,
  isAuthenticated,
} from "../services/authService";
import { toast } from "react-toastify";

// Receive state and update function as props
function Header({
  isLoggedIn,
  isAdmin,
  userName,
  updateAuthState,
  cartUpdateTrigger,
}) {
  const [cartItemCount, setCartItemCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch cart count
    const fetchCartCount = async () => {
      try {
        const cart = await cartService.getCart();
        setCartItemCount(cart.quantityTotal || 0);
      } catch (error) {
        console.error("Error fetching cart count:", error);
        setCartItemCount(0);
      }
    };
    fetchCartCount();
  }, [cartUpdateTrigger]); // Refetch cart count when cartUpdateTrigger changes

  const handleLogout = async () => {
    try {
      await logout();
      // Call updateAuthState to reset state in App.jsx
      updateAuthState(null);
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to logout");
    }
  };

  // Enhanced Styles
  const navbarStyle = {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(15px)",
    boxShadow: "0 8px 32px rgba(99, 102, 241, 0.1)",
    padding: "0.75rem 0",
    transition: "all 0.3s ease",
    borderBottom: "1px solid rgba(99, 102, 241, 0.1)",
  };

  const brandStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
    textDecoration: "none",
    transition: "transform 0.3s ease",
  };

  const brandLogoStyle = {
    width: "45px",
    height: "45px",
    background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
    transition: "transform 0.3s ease",
  };

  const brandTextStyle = {
    fontSize: "1.5rem",
    fontWeight: "700",
    background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    fontFamily: "Inter, -apple-system, sans-serif",
  };

  const navLinkStyle = {
    color: "#4b5563",
    fontWeight: "500",
    fontSize: "1rem",
    margin: "0 0.5rem",
    padding: "0.6rem 1.2rem",
    borderRadius: "12px",
    transition: "all 0.3s ease",
    cursor: "pointer",
    position: "relative",
    textDecoration: "none",
    fontFamily: "Inter, -apple-system, sans-serif",
  };

  const userGreetingStyle = {
    color: "#1f2937",
    fontWeight: "600",
    fontSize: "0.95rem",
    marginRight: "1rem",
    fontFamily: "Inter, -apple-system, sans-serif",
  };

  const primaryButtonStyle = {
    background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    border: "none",
    color: "white",
    padding: "10px 28px",
    fontWeight: "600",
    borderRadius: "25px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
    fontFamily: "Inter, -apple-system, sans-serif",
    fontSize: "0.95rem",
  };

  const outlineButtonStyle = {
    background: "transparent",
    border: "2px solid rgba(99, 102, 241, 0.2)",
    color: "#6366f1",
    padding: "8px 24px",
    fontWeight: "600",
    borderRadius: "25px",
    transition: "all 0.3s ease",
    fontFamily: "Inter, -apple-system, sans-serif",
    fontSize: "0.95rem",
  };

  const logoutButtonStyle = {
    background: "rgba(239, 68, 68, 0.1)",
    border: "2px solid rgba(239, 68, 68, 0.3)",
    color: "#ef4444",
    padding: "8px 24px",
    fontWeight: "600",
    borderRadius: "25px",
    transition: "all 0.3s ease",
    fontFamily: "Inter, -apple-system, sans-serif",
    fontSize: "0.95rem",
  };

  const cartButtonStyle = {
    background: "rgba(99, 102, 241, 0.1)",
    border: "2px solid rgba(99, 102, 241, 0.2)",
    color: "#6366f1",
    padding: "8px 16px",
    fontWeight: "600",
    borderRadius: "12px",
    transition: "all 0.3s ease",
    position: "relative",
    fontFamily: "Inter, -apple-system, sans-serif",
    fontSize: "0.95rem",
    marginRight: "1rem",
  };

  const cartBadgeStyle = {
    position: "absolute",
    top: "-8px",
    right: "-8px",
    background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
    color: "white",
    fontSize: "0.7rem",
    fontWeight: "600",
    padding: "4px 8px",
    borderRadius: "12px",
    minWidth: "20px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(239, 68, 68, 0.3)",
  };

  const adminBadgeStyle = {
    color: "#7c3aed",
    fontSize: "0.75rem",
    fontWeight: "600",
    background: "rgba(124, 58, 237, 0.1)",
    padding: "4px 12px",
    borderRadius: "8px",
    marginLeft: "8px",
    border: "1px solid rgba(124, 58, 237, 0.2)",
  };

  return (
    <>
      <Navbar expand="lg" sticky="top" style={navbarStyle}>
        <Container fluid>
          <Navbar.Brand
            onClick={() => navigate("/")}
            style={brandStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <div
              style={brandLogoStyle}
              onMouseEnter={(e) => {
                e.target.style.transform = "rotate(5deg) scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "rotate(0deg) scale(1)";
              }}
            >
              🐾
            </div>
            <span style={brandTextStyle}>Pet-Mart</span>
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            style={{
              border: "2px solid rgba(99, 102, 241, 0.2)",
              borderRadius: "8px",
              padding: "4px 8px",
            }}
          />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link
                onClick={() => navigate("/")}
                style={navLinkStyle}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(99, 102, 241, 0.1)";
                  e.target.style.color = "#6366f1";
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.color = "#4b5563";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Home
              </Nav.Link>
              <Nav.Link
                onClick={() => navigate("/find-pet")}
                style={navLinkStyle}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(99, 102, 241, 0.1)";
                  e.target.style.color = "#6366f1";
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.color = "#4b5563";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Find Your Pet
              </Nav.Link>
              <Nav.Link
                onClick={() => navigate("/about")}
                style={navLinkStyle}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(99, 102, 241, 0.1)";
                  e.target.style.color = "#6366f1";
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.color = "#4b5563";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                About
              </Nav.Link>
              {isAdmin && (
                <Nav.Link
                  onClick={() => navigate("/admin")}
                  style={{
                    ...navLinkStyle,
                    background: "rgba(124, 58, 237, 0.1)",
                    color: "#7c3aed",
                    border: "1px solid rgba(124, 58, 237, 0.2)",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#7c3aed";
                    e.target.style.color = "white";
                    e.target.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(124, 58, 237, 0.1)";
                    e.target.style.color = "#7c3aed";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  Admin Dashboard
                </Nav.Link>
              )}
            </Nav>

            <Nav className="ms-auto align-items-center">
              {!isAdmin && (
                <Button
                  variant="outline-primary"
                  style={cartButtonStyle}
                  onClick={() => navigate("/cart")}
                >
                  🛒 Cart
                  {cartItemCount > 0 && (
                    <Badge style={cartBadgeStyle}>{cartItemCount}</Badge>
                  )}
                </Button>
              )}

              {isLoggedIn ? (
                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center">
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        background:
                          "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "12px",
                        boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
                      }}
                    >
                      <span
                        style={{
                          color: "white",
                          fontSize: "14px",
                          fontWeight: "600",
                          fontFamily: "Inter, -apple-system, sans-serif",
                        }}
                      >
                        {userName?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span style={userGreetingStyle}>Welcome, {userName}</span>
                      {isAdmin && <span style={adminBadgeStyle}>Admin</span>}
                    </div>
                  </div>
                  <Button
                    style={logoutButtonStyle}
                    onClick={handleLogout}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#ef4444";
                      e.target.style.color = "white";
                      e.target.style.transform = "translateY(-1px)";
                      e.target.style.boxShadow =
                        "0 4px 12px rgba(239, 68, 68, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(239, 68, 68, 0.1)";
                      e.target.style.color = "#ef4444";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <Button
                    style={outlineButtonStyle}
                    onClick={() => navigate("/register")}
                    onMouseEnter={(e) => {
                      e.target.style.background = "rgba(99, 102, 241, 0.1)";
                      e.target.style.borderColor = "#6366f1";
                      e.target.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "transparent";
                      e.target.style.borderColor = "rgba(99, 102, 241, 0.2)";
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    Register
                  </Button>
                  <Button
                    style={primaryButtonStyle}
                    onClick={() => navigate("/signin")}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow =
                        "0 6px 20px rgba(99, 102, 241, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow =
                        "0 4px 15px rgba(99, 102, 241, 0.3)";
                    }}
                  >
                    Sign In
                  </Button>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
