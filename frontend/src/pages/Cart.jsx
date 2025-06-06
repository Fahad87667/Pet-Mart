import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Image,
  Card,
  Alert,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { cartService } from "../services/cartService";
import { toast } from "react-toastify";

function Cart({ onAddToCartSuccess }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const data = await cartService.getCart();
      setCart(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError(err.message || "Failed to load cart.");
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productCode, quantity) => {
    if (quantity <= 0) {
      handleRemoveItem(productCode);
      return;
    }
    try {
      const updatedCart = await cartService.updateCartItem(
        productCode,
        quantity
      );
      setCart(updatedCart);
      if (onAddToCartSuccess) {
        onAddToCartSuccess(updatedCart);
      }
      toast.success("Cart updated successfully!", {
        autoClose: 1000,
      });
    } catch (err) {
      console.error("Error updating quantity:", err);
      toast.error("Failed to update item quantity.", {
        autoClose: 1000,
      });
      setError(err.message || "Failed to update item quantity.");
    }
  };

  const handleRemoveItem = async (productCode) => {
    try {
      const updatedCart = await cartService.removeFromCart(productCode);
      setCart(updatedCart);
      if (onAddToCartSuccess) {
        onAddToCartSuccess(updatedCart);
      }
      toast.error("Pet removed from adoption list!", {
        autoClose: 1000,
      });
    } catch (err) {
      console.error("Error removing item:", err);
      if (err.message === "AUTHENTICATION_REQUIRED") {
        toast.error("Please sign in to manage your adoption list", {
          autoClose: 1000,
        });
        navigate("/signin");
      } else {
        toast.error("Failed to remove pet from list.", {
          autoClose: 1000,
        });
        setError(err.message || "Failed to remove pet from list.");
      }
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <div
          className="spinner-border"
          role="status"
          style={{
            width: "3rem",
            height: "3rem",
            borderColor: "#6366f1",
            borderRightColor: "transparent",
          }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert
          variant="danger"
          style={{
            borderRadius: "15px",
            border: "none",
            background: "rgba(239, 68, 68, 0.1)",
            color: "#dc2626",
            padding: "1.5rem",
          }}
        >
          <i className="bi bi-exclamation-circle-fill me-2"></i>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!cart || !cart.cartLines || cart.cartLines.length === 0) {
    return (
      <div
        style={{
          background: "linear-gradient(135deg, #e0e7ff 0%, #f0e6ff 100%)",
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container className="text-center">
          <div
            style={{
              fontSize: "6rem",
              animation: "bounce 2s infinite",
              marginBottom: "1rem",
            }}
          >
            🐾
          </div>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "800",
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "1rem",
            }}
          >
            No Pets Selected Yet
          </h1>
          <p
            style={{
              color: "#6b7280",
              marginBottom: "2rem",
              fontSize: "1.1rem",
            }}
          >
            Start browsing to find your perfect furry companion!
          </p>
          <Button
            variant="primary"
            href="/find-pet"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              border: "none",
              borderRadius: "30px",
              padding: "1rem 3rem",
              fontWeight: "600",
              fontSize: "1.1rem",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 20px rgba(99, 102, 241, 0.4)",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-3px) scale(1.05)";
              e.target.style.boxShadow = "0 8px 25px rgba(99, 102, 241, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0) scale(1)";
              e.target.style.boxShadow = "0 4px 20px rgba(99, 102, 241, 0.4)";
            }}
          >
            Browse Available Pets 🐕
          </Button>
        </Container>

        <style jsx>{`
          @keyframes bounce {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-20px);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #e0e7ff 0%, #f0e6ff 100%)",
        minHeight: "100vh",
        paddingTop: "3rem",
        paddingBottom: "3rem",
      }}
    >
      <Container>
        <div style={{ marginBottom: "3rem", textAlign: "center" }}>
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "800",
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "0.5rem",
            }}
          >
            Your Adoption List
          </h1>
          <p style={{ color: "#6b7280", fontSize: "1.1rem" }}>
            Review the pets you're interested in adopting
          </p>
        </div>

        <Row className="g-4">
          <Col lg={8}>
            <Card
              style={{
                background: "white",
                borderRadius: "25px",
                border: "none",
                boxShadow: "0 20px 40px rgba(99, 102, 241, 0.15)",
                overflow: "hidden",
                transition: "all 0.3s ease",
              }}
            >
              <Card.Body style={{ padding: "0" }}>
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, #f3f4f6 0%, #faf5ff 100%)",
                    padding: "2rem 2rem 1rem",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <h5
                    style={{ fontWeight: "700", color: "#374151", margin: 0 }}
                  >
                    <i
                      className="bi bi-heart-fill me-2"
                      style={{ color: "#ef4444" }}
                    ></i>
                    Selected Pets
                    <Badge
                      bg="primary"
                      style={{
                        marginLeft: "1rem",
                        background:
                          "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                        borderRadius: "20px",
                        padding: "0.4rem 0.8rem",
                      }}
                    >
                      {cart.quantityTotal} pets
                    </Badge>
                  </h5>
                </div>

                <div style={{ padding: "1.5rem" }}>
                  {cart.cartLines.map((item, index) => (
                    <div
                      key={`${item.productCode}-${index}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "1.5rem",
                        marginBottom: "1rem",
                        borderRadius: "15px",
                        background: "#f9fafb",
                        border: "1px solid #e5e7eb",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow =
                          "0 5px 15px rgba(99, 102, 241, 0.1)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      <Image
                        src={
                          item.productInfo.imagePath
                            ? `http://localhost:8080${item.productInfo.imagePath}`
                            : "https://via.placeholder.com/100?text=No+Image"
                        }
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "15px",
                          marginRight: "1.5rem",
                          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                        }}
                      />

                      <div style={{ flex: 1 }}>
                        <h6
                          style={{
                            fontWeight: "700",
                            color: "#1f2937",
                            marginBottom: "0.5rem",
                            fontSize: "1.1rem",
                          }}
                        >
                          {item.productInfo.name}
                        </h6>
                        <p
                          style={{
                            color: "#6b7280",
                            marginBottom: 0,
                            fontSize: "0.9rem",
                          }}
                        >
                          <i
                            className="bi bi-geo-alt-fill me-1"
                            style={{ color: "#6366f1" }}
                          ></i>
                          Ready for adoption
                        </p>
                      </div>

                      <div style={{ textAlign: "right", marginRight: "2rem" }}>
                        <p
                          style={{
                            color: "#6b7280",
                            fontSize: "0.9rem",
                            marginBottom: "0.25rem",
                          }}
                        >
                          Adoption Fee
                        </p>
                        <p
                          style={{
                            fontSize: "1.5rem",
                            fontWeight: "700",
                            background:
                              "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            marginBottom: 0,
                          }}
                        >
                          ₹{item.productInfo.price.toFixed(2)}
                        </p>
                      </div>

                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemoveItem(item.productInfo.code)}
                        style={{
                          borderRadius: "10px",
                          padding: "0.5rem 1rem",
                          border: "2px solid #ef4444",
                          color: "#ef4444",
                          fontWeight: "600",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#ef4444";
                          e.target.style.color = "white";
                          e.target.style.transform = "scale(1.05)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "transparent";
                          e.target.style.color = "#ef4444";
                          e.target.style.transform = "scale(1)";
                        }}
                      >
                        <i className="bi bi-x-circle-fill"></i> Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card
              style={{
                background: "white",
                borderRadius: "25px",
                border: "none",
                boxShadow: "0 20px 40px rgba(99, 102, 241, 0.15)",
                position: "sticky",
                top: "2rem",
              }}
            >
              <Card.Body style={{ padding: "2rem" }}>
                <h5
                  style={{
                    fontWeight: "800",
                    marginBottom: "2rem",
                    color: "#1f2937",
                    fontSize: "1.3rem",
                  }}
                >
                  <i
                    className="bi bi-clipboard-check me-2"
                    style={{ color: "#6366f1" }}
                  ></i>
                  Adoption Summary
                </h5>

                <div
                  style={{
                    background:
                      "linear-gradient(135deg, #f3f4f6 0%, #faf5ff 100%)",
                    borderRadius: "15px",
                    padding: "1.5rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "1rem",
                      marginBottom: "1rem",
                      color: "#6b7280",
                    }}
                  >
                    <span>Number of Pets:</span>
                    <span style={{ fontWeight: "600", color: "#4b5563" }}>
                      {cart.quantityTotal}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "1rem",
                      marginBottom: "1rem",
                      color: "#6b7280",
                    }}
                  >
                    <span>Total Adoption Fees:</span>
                    <span style={{ fontWeight: "600", color: "#4b5563" }}>
                      ₹{cart.amountTotal.toFixed(2)}
                    </span>
                  </div>

                  <hr style={{ margin: "1rem 0", borderColor: "#e5e7eb" }} />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "1.6rem",
                      fontWeight: "800",
                      background:
                        "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    <span>Total:</span>
                    <span>₹{cart.amountTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div
                  style={{
                    background:
                      "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                    color: "#92400e",
                    padding: "1rem",
                    borderRadius: "10px",
                    textAlign: "center",
                    marginBottom: "1.5rem",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                  }}
                >
                  <i className="bi bi-info-circle-fill me-2"></i>
                  Adoption fees help cover medical care and shelter costs
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate("/checkout", { state: { cart } })}
                  style={{
                    background:
                      "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                    border: "none",
                    borderRadius: "15px",
                    padding: "1rem 2rem",
                    fontWeight: "700",
                    fontSize: "1.1rem",
                    transition: "all 0.3s ease",
                    boxShadow: "0 10px 25px rgba(99, 102, 241, 0.3)",
                    width: "100%",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow =
                      "0 15px 30px rgba(99, 102, 241, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow =
                      "0 10px 25px rgba(99, 102, 241, 0.3)";
                  }}
                >
                  <span style={{ position: "relative", zIndex: 1 }}>
                    Continue to Application
                    <i className="bi bi-arrow-right-circle-fill ms-2"></i>
                  </span>
                </Button>

                <div
                  style={{
                    marginTop: "1.5rem",
                    padding: "1rem",
                    background: "#f9fafb",
                    borderRadius: "10px",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      marginBottom: "0.5rem",
                      color: "#6b7280",
                      fontSize: "0.9rem",
                    }}
                  >
                    <i
                      className="bi bi-clock-fill me-1"
                      style={{ color: "#10b981" }}
                    ></i>
                    Next Steps
                  </p>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "0.85rem",
                      marginBottom: 0,
                    }}
                  >
                    Complete adoption application • Home visit • Meet your new
                    pet
                  </p>
                </div>
              </Card.Body>
            </Card>

            <Card
              style={{
                background: "linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%)",
                borderRadius: "20px",
                border: "1px solid #e5e7eb",
                marginTop: "1.5rem",
                padding: "1.5rem",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <i
                  className="bi bi-house-heart-fill"
                  style={{
                    fontSize: "2rem",
                    color: "#6366f1",
                    marginBottom: "0.5rem",
                    display: "block",
                  }}
                ></i>
                <h6
                  style={{
                    fontWeight: "700",
                    color: "#374151",
                    marginBottom: "0.5rem",
                  }}
                >
                  Why Adopt?
                </h6>
                <p
                  style={{
                    color: "#6b7280",
                    fontSize: "0.9rem",
                    marginBottom: 0,
                  }}
                >
                  Give a loving pet a second chance at happiness
                </p>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .bi {
          font-style: normal;
        }
      `}</style>
    </div>
  );
}

export default Cart;
