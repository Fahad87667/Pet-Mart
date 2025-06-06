import React, { useState, useEffect } from "react";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Badge,
  Dropdown,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { cartService } from "../services/cartService";
import {
  getCurrentUser,
  logout,
  isAuthenticated,
} from "../services/authService";
import { toast } from "react-toastify";

function Header({
  isLoggedIn,
  isAdmin,
  userName,
  updateAuthState,
  cartUpdateTrigger,
}) {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
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
  }, [cartUpdateTrigger]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      updateAuthState(null);
      toast.success("Logged out successfully", {
        autoClose: 1000,
        position: "top-center",
      });
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to logout", {
        autoClose: 1000,
        position: "top-center",
      });
    }
  };

  // Enhanced Dynamic Styles
  const navbarStyle = {
    background: scrolled
      ? "rgba(255, 255, 255, 0.98)"
      : "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    boxShadow: scrolled
      ? "0 12px 40px rgba(99, 102, 241, 0.15)"
      : "0 8px 32px rgba(99, 102, 241, 0.1)",
    padding: scrolled ? "0.5rem 0" : "0.75rem 0",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
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
    width: scrolled ? "55px" : "65px",
    height: scrolled ? "55px" : "65px",
    background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 20px rgba(99, 102, 241, 0.3)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    overflow: "hidden",
    position: "relative",
  };

  const brandTextStyle = {
    fontSize: scrolled ? "1.6rem" : "1.8rem",
    fontWeight: "800",
    background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    fontFamily: "'Poppins', -apple-system, sans-serif",
    letterSpacing: "-0.02em",
    transition: "all 0.3s ease",
  };

  const navLinkStyle = {
    color: "#4b5563",
    fontWeight: "500",
    fontSize: "1rem",
    margin: "0 0.25rem",
    padding: "0.6rem 1.2rem",
    borderRadius: "12px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    position: "relative",
    textDecoration: "none",
    fontFamily: "'Inter', -apple-system, sans-serif",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  };

  const primaryButtonStyle = {
    background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    border: "none",
    color: "white",
    padding: "10px 28px",
    fontWeight: "600",
    borderRadius: "25px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 4px 20px rgba(99, 102, 241, 0.3)",
    fontFamily: "'Inter', -apple-system, sans-serif",
    fontSize: "0.95rem",
    position: "relative",
    overflow: "hidden",
  };

  const cartButtonStyle = {
    background: "rgba(99, 102, 241, 0.1)",
    border: "2px solid transparent",
    color: "#6366f1",
    padding: "10px 20px",
    fontWeight: "600",
    borderRadius: "20px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    fontFamily: "'Inter', -apple-system, sans-serif",
    fontSize: "0.95rem",
    marginRight: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const cartBadgeStyle = {
    position: "absolute",
    top: "-10px",
    right: "-10px",
    background: "linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)",
    color: "white",
    fontSize: "0.75rem",
    fontWeight: "700",
    padding: "4px 8px",
    borderRadius: "12px",
    minWidth: "22px",
    textAlign: "center",
    boxShadow: "0 2px 10px rgba(239, 68, 68, 0.4)",
    animation: cartItemCount > 0 ? "pulse 2s infinite" : "none",
  };

  const profileDropdownStyle = {
    background: "white",
    border: "1px solid rgba(99, 102, 241, 0.1)",
    borderRadius: "16px",
    boxShadow: "0 10px 40px rgba(99, 102, 241, 0.15)",
    padding: "0.5rem",
    marginTop: "0.5rem",
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
                e.currentTarget.style.transform = "rotate(5deg) scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "rotate(0deg) scale(1)";
              }}
            >
              <img
                src="/images/logo.jpg"
                alt="Pet-Mart Logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  padding: "8px",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.5) 50%, transparent 70%)",
                  transform: "translateX(-100%)",
                  transition: "transform 0.6s",
                }}
                className="shine"
              />
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
                  e.currentTarget.style.background = "rgba(99, 102, 241, 0.1)";
                  e.currentTarget.style.color = "#6366f1";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#4b5563";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>🏠</span> Home
              </Nav.Link>
              <Nav.Link
                onClick={() => navigate("/find-pet")}
                style={navLinkStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(99, 102, 241, 0.1)";
                  e.currentTarget.style.color = "#6366f1";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#4b5563";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>🐾</span> Find Your Pet
              </Nav.Link>
              <Nav.Link
                onClick={() => navigate("/about")}
                style={navLinkStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(99, 102, 241, 0.1)";
                  e.currentTarget.style.color = "#6366f1";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#4b5563";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>ℹ️</span> About
              </Nav.Link>
              {isAdmin && (
                <Nav.Link
                  onClick={() => navigate("/admin")}
                  style={{
                    ...navLinkStyle,
                    background:
                      "linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(168, 85, 247, 0.1))",
                    color: "#7c3aed",
                    border: "1px solid rgba(124, 58, 237, 0.2)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, #7c3aed, #a855f7)";
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 20px rgba(124, 58, 237, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(168, 85, 247, 0.1))";
                    e.currentTarget.style.color = "#7c3aed";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <span style={{ fontSize: "1.2rem" }}>⚙️</span> Admin Dashboard
                </Nav.Link>
              )}
            </Nav>

            <Nav className="ms-auto align-items-center">
              {!isAdmin && (
                <Button
                  variant="outline-primary"
                  style={cartButtonStyle}
                  onClick={() => {
                    if (!isLoggedIn) {
                      toast.info("Please sign in to view your cart", {
                        position: "top-center",
                        autoClose: 2000,
                        onClose: () => navigate("/signin")
                      });
                    } else {
                      navigate("/cart");
                    }
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, #6366f1, #a855f7)";
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.transform =
                      "translateY(-2px) scale(1.05)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 20px rgba(99, 102, 241, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "rgba(99, 102, 241, 0.1)";
                    e.currentTarget.style.color = "#6366f1";
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <span style={{ fontSize: "1.2rem" }}>🛒</span> Cart
                  {cartItemCount > 0 && (
                    <Badge style={cartBadgeStyle}>{cartItemCount}</Badge>
                  )}
                </Button>
              )}

              {isLoggedIn ? (
                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="none"
                    style={{
                      ...navLinkStyle,
                      border: "2px solid rgba(99, 102, 241, 0.2)",
                      borderRadius: "25px",
                      padding: "8px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "35px",
                        height: "35px",
                        background:
                          "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 10px rgba(99, 102, 241, 0.3)",
                        color: "white",
                        fontSize: "14px",
                        fontWeight: "700",
                        fontFamily: "'Inter', -apple-system, sans-serif",
                      }}
                    >
                      {userName?.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: "600" }}>
                      {userName || "Profile"}
                    </span>
                    {isAdmin && (
                      <Badge
                        bg="none"
                        style={{
                          background:
                            "linear-gradient(135deg, #7c3aed, #a855f7)",
                          color: "white",
                          fontSize: "0.7rem",
                          fontWeight: "600",
                          padding: "4px 8px",
                          borderRadius: "8px",
                        }}
                      >
                        Admin
                      </Badge>
                    )}
                  </Dropdown.Toggle>

                  <Dropdown.Menu style={profileDropdownStyle}>
                    <Dropdown.Item
                      onClick={() => navigate("/profile")}
                      style={{
                        borderRadius: "12px",
                        padding: "12px 20px",
                        transition: "all 0.2s ease",
                        fontWeight: "500",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(99, 102, 241, 0.1)";
                        e.currentTarget.style.color = "#6366f1";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "inherit";
                      }}
                    >
                      <span style={{ fontSize: "1.2rem" }}>👤</span> My Profile
                    </Dropdown.Item>

                    <Dropdown.Divider style={{ margin: "0.5rem 0" }} />

                    <Dropdown.Item
                      onClick={handleLogout}
                      style={{
                        borderRadius: "12px",
                        padding: "12px 20px",
                        transition: "all 0.2s ease",
                        fontWeight: "500",
                        color: "#ef4444",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(239, 68, 68, 0.1)";
                        e.currentTarget.style.color = "#dc2626";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#ef4444";
                      }}
                    >
                      <span style={{ fontSize: "1.2rem" }}>🚪</span> Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <div className="d-flex gap-2">
                  <Button
                    variant="outline"
                    style={{
                      background: "transparent",
                      border: "2px solid rgba(99, 102, 241, 0.2)",
                      color: "#6366f1",
                      padding: "10px 24px",
                      fontWeight: "600",
                      borderRadius: "25px",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      fontFamily: "'Inter', -apple-system, sans-serif",
                      fontSize: "0.95rem",
                    }}
                    onClick={() => navigate("/register")}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(99, 102, 241, 0.1)";
                      e.currentTarget.style.borderColor = "#6366f1";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor =
                        "rgba(99, 102, 241, 0.2)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    Register
                  </Button>
                  <Button
                    style={primaryButtonStyle}
                    onClick={() => navigate("/signin")}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        "translateY(-2px) scale(1.05)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 25px rgba(99, 102, 241, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform =
                        "translateY(0) scale(1)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 20px rgba(99, 102, 241, 0.3)";
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

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

          @keyframes pulse {
            0% {
              transform: scale(1);
              box-shadow: 0 2px 10px rgba(239, 68, 68, 0.4);
            }
            50% {
              transform: scale(1.1);
              box-shadow: 0 2px 15px rgba(239, 68, 68, 0.6);
            }
            100% {
              transform: scale(1);
              box-shadow: 0 2px 10px rgba(239, 68, 68, 0.4);
            }
          }

          .navbar-toggler {
            border: 2px solid rgba(99, 102, 241, 0.2) !important;
          }

          .navbar-toggler:focus {
            box-shadow: 0 0 0 0.25rem rgba(99, 102, 241, 0.25) !important;
          }

          .navbar-toggler-icon {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%2899, 102, 241, 0.8%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e") !important;
          }

          .dropdown-toggle::after {
            display: none;
          }

          .dropdown-menu {
            animation: fadeIn 0.2s ease-out;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .shine:hover {
            transform: translateX(100%) !important;
          }

          @media (max-width: 991px) {
            .navbar-collapse {
              background: rgba(255, 255, 255, 0.98);
              backdrop-filter: blur(20px);
              margin-top: 1rem;
              padding: 1rem;
              border-radius: 16px;
              box-shadow: 0 10px 40px rgba(99, 102, 241, 0.1);
            }

            .navbar-nav {
              gap: 0.5rem;
            }

            .navbar-nav .nav-link {
              border-radius: 12px !important;
              padding: 0.8rem 1rem !important;
            }

            .navbar-nav .nav-link:hover {
              background: rgba(99, 102, 241, 0.1) !important;
            }

            .ms-auto {
              margin-top: 1rem !important;
              padding-top: 1rem;
              border-top: 1px solid rgba(99, 102, 241, 0.1);
            }
          }

          .navbar {
            animation: slideDown 0.5s ease-out;
          }

          @keyframes slideDown {
            from {
              transform: translateY(-100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </>
  );
}

export default Header;
