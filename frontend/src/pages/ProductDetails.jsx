import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Spinner,
} from "react-bootstrap";
import { productService } from "../services/productService";
import { cartService } from "../services/cartService";
import { toast } from "react-toastify";
import { getCurrentUser } from "../services/authService";

function ProductDetails({ onAddToCartSuccess }) {
  const { code } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await productService.getProduct(code);
        setProduct(response);
        setError(null);
        // Check login
        const user = await getCurrentUser();
        setIsLoggedIn(!!user);
        // Check cart
        const cart = await cartService.getCart();
        const inCart = cart.cartLines?.some(
          (line) => line.productInfo?.code === code
        );
        setIsAddedToCart(inCart);
      } catch (err) {
        setError(err.message || "Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [code]);

  const handleCartAction = async () => {
    if (!isLoggedIn) {
      toast.info("Please sign in to add items to cart", {
        position: "top-center",
        autoClose: 2000,
        onClose: () => navigate("/signin"),
      });
      return;
    }
    if (!product) return;
    setAddingToCart(true);
    try {
      if (isAddedToCart) {
        const updatedCart = await cartService.removeFromCart(product.code);
        toast.error("Removed from cart!", { autoClose: 1000 });
        setIsAddedToCart(false);
        // If cart is empty, update any local state if needed
        if (
          !updatedCart ||
          !updatedCart.cartLines ||
          updatedCart.cartLines.length === 0
        ) {
          // Optionally, trigger a global cart update or clear local cart state
        }
      } else {
        await cartService.addToCart(product.code, 1);
        toast.success("Added to cart!", { autoClose: 1000 });
        setIsAddedToCart(true);
      }
      if (onAddToCartSuccess) {
        const updatedCart = await cartService.getCart();
        onAddToCartSuccess(updatedCart);
      }
    } catch (error) {
      toast.error(
        isAddedToCart ? "Failed to remove from cart" : "Failed to add to cart"
      );
    } finally {
      setAddingToCart(false);
    }
  };

  const getTypeBadgeColor = (type) => {
    const colors = {
      DOG: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
      CAT: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
      BIRD: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    };
    return colors[type] || "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)";
  };

  const getStatusColor = (status) => {
    return status === "AVAILABLE" ? "#10b981" : "#ef4444";
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 116px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #e0e7ff 0%, #f0e6ff 100%)",
        }}
      >
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
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 116px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #e0e7ff 0%, #f0e6ff 100%)",
        }}
      >
        <Card
          style={{
            background: "white",
            borderRadius: "30px",
            border: "none",
            boxShadow: "0 20px 40px rgba(99, 102, 241, 0.15)",
            padding: "3rem",
            maxWidth: "500px",
          }}
        >
          <Card.Body className="text-center">
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>😿</div>
            <h3
              style={{
                color: "#ef4444",
                marginBottom: "1rem",
                fontWeight: "700",
              }}
            >
              Oops! Something went wrong
            </h3>
            <p style={{ color: "#6b7280", marginBottom: "2rem" }}>{error}</p>
            <Button
              variant="primary"
              onClick={() => navigate("/find-pet")}
              style={{
                borderRadius: "30px",
                padding: "0.75rem 2.5rem",
                fontWeight: "600",
                background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                border: "none",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(99, 102, 241, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(99, 102, 241, 0.3)";
              }}
            >
              Back to Find Pet
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #e0e7ff 0%, #f0e6ff 100%)",
        minHeight: "calc(100vh - 116px)",
        paddingTop: "2rem",
        paddingBottom: "3rem",
      }}
    >
      <Container>
        <Button
          variant="link"
          onClick={() => navigate("/find-pet")}
          style={{
            color: "#6366f1",
            textDecoration: "none",
            fontWeight: "600",
            marginBottom: "2rem",
            padding: 0,
            display: "flex",
            alignItems: "center",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateX(-5px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateX(0)";
          }}
        >
          <i
            className="bi bi-arrow-left-circle-fill me-2"
            style={{ fontSize: "1.5rem" }}
          ></i>
          Back to Find Pet
        </Button>

        <Card
          style={{
            borderRadius: "30px",
            border: "none",
            boxShadow: "0 20px 60px rgba(99, 102, 241, 0.15)",
            overflow: "hidden",
            background: "white",
          }}
        >
          <Row className="g-0">
            <Col lg={6}>
              <div
                style={{
                  position: "relative",
                  height: "100%",
                  minHeight: "600px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={
                    product.imagePath
                      ? `http://localhost:8080${product.imagePath}`
                      : "https://via.placeholder.com/600"
                  }
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <Badge
                  style={{
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    background: getTypeBadgeColor(product.type),
                    color: "white",
                    padding: "0.5rem 1.5rem",
                    borderRadius: "25px",
                    fontWeight: "700",
                    fontSize: "0.9rem",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <i className="bi bi-heart-fill me-1"></i> {product.type}
                </Badge>
              </div>
            </Col>

            <Col lg={6}>
              <div style={{ padding: "3rem" }}>
                <div style={{ marginBottom: "2rem" }}>
                  <h1
                    style={{
                      fontSize: "3rem",
                      fontWeight: "800",
                      color: "#1f2937",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {product.name}
                  </h1>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "2.5rem",
                        fontWeight: "800",
                        background:
                          "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      ₹{product.price?.toFixed(2) || "0.00"}
                    </div>
                    <Badge
                      style={{
                        background:
                          "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        color: "white",
                        padding: "0.4rem 1rem",
                        borderRadius: "20px",
                        fontWeight: "600",
                      }}
                    >
                      Adoption Fee
                    </Badge>
                  </div>
                </div>

                <div
                  style={{
                    background:
                      "linear-gradient(135deg, #f3f4f6 0%, #faf5ff 100%)",
                    borderRadius: "20px",
                    padding: "1.5rem",
                    marginBottom: "2rem",
                  }}
                >
                  <h5
                    style={{
                      fontWeight: "700",
                      color: "#374151",
                      marginBottom: "1rem",
                      fontSize: "1.1rem",
                    }}
                  >
                    <i
                      className="bi bi-info-circle-fill me-2"
                      style={{ color: "#6366f1" }}
                    ></i>
                    About {product.name}
                  </h5>
                  <p
                    style={{
                      color: "#6b7280",
                      marginBottom: 0,
                      lineHeight: "1.6",
                    }}
                  >
                    {product.description ||
                      `Meet ${
                        product.name
                      } - a wonderful pet looking for their forever home. 
                    This adorable ${
                      product.type?.toLowerCase() || "pet"
                    } will bring joy and companionship to any family.`}
                  </p>
                </div>

                <div style={{ marginBottom: "2rem" }}>
                  <h5
                    style={{
                      fontWeight: "700",
                      color: "#374151",
                      marginBottom: "1.5rem",
                      fontSize: "1.1rem",
                    }}
                  >
                    <i
                      className="bi bi-card-list me-2"
                      style={{ color: "#6366f1" }}
                    ></i>
                    Pet Details
                  </h5>

                  <Row className="g-3">
                    <Col xs={6}>
                      <div
                        style={{
                          background: "white",
                          border: "2px solid #e5e7eb",
                          borderRadius: "15px",
                          padding: "1rem",
                          textAlign: "center",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#6366f1";
                          e.currentTarget.style.boxShadow =
                            "0 5px 15px rgba(99, 102, 241, 0.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#e5e7eb";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <p
                          style={{
                            color: "#6b7280",
                            marginBottom: "0.25rem",
                            fontSize: "0.9rem",
                          }}
                        >
                          Breed
                        </p>
                        <p
                          style={{
                            fontWeight: "700",
                            color: "#1f2937",
                            marginBottom: 0,
                          }}
                        >
                          {product.breed || product.type}
                        </p>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div
                        style={{
                          background: "white",
                          border: "2px solid #e5e7eb",
                          borderRadius: "15px",
                          padding: "1rem",
                          textAlign: "center",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#6366f1";
                          e.currentTarget.style.boxShadow =
                            "0 5px 15px rgba(99, 102, 241, 0.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#e5e7eb";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <p
                          style={{
                            color: "#6b7280",
                            marginBottom: "0.25rem",
                            fontSize: "0.9rem",
                          }}
                        >
                          Age
                        </p>
                        <p
                          style={{
                            fontWeight: "700",
                            color: "#1f2937",
                            marginBottom: 0,
                          }}
                        >
                          {product.age || "Young"}
                        </p>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div
                        style={{
                          background: "white",
                          border: "2px solid #e5e7eb",
                          borderRadius: "15px",
                          padding: "1rem",
                          textAlign: "center",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#6366f1";
                          e.currentTarget.style.boxShadow =
                            "0 5px 15px rgba(99, 102, 241, 0.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#e5e7eb";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <p
                          style={{
                            color: "#6b7280",
                            marginBottom: "0.25rem",
                            fontSize: "0.9rem",
                          }}
                        >
                          Gender
                        </p>
                        <p
                          style={{
                            fontWeight: "700",
                            color: "#1f2937",
                            marginBottom: 0,
                          }}
                        >
                          {product.gender || "Not specified"}
                        </p>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div
                        style={{
                          background: "white",
                          border: "2px solid #e5e7eb",
                          borderRadius: "15px",
                          padding: "1rem",
                          textAlign: "center",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = getStatusColor(
                            product.status
                          );
                          e.currentTarget.style.boxShadow = `0 5px 15px rgba(16, 185, 129, 0.1)`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#e5e7eb";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <p
                          style={{
                            color: "#6b7280",
                            marginBottom: "0.25rem",
                            fontSize: "0.9rem",
                          }}
                        >
                          Status
                        </p>
                        <p
                          style={{
                            fontWeight: "700",
                            color: getStatusColor(product.status),
                            marginBottom: 0,
                          }}
                        >
                          {product.status || "Available"}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </div>

                <div
                  style={{
                    marginTop: "2rem",
                    padding: "1rem",
                    background:
                      "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                    borderRadius: "15px",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      color: "#92400e",
                      marginBottom: 0,
                      fontWeight: "600",
                    }}
                  >
                    <i className="bi bi-shield-check me-2"></i>
                    All pets are vaccinated and health-checked
                  </p>
                </div>

                <div
                  style={{
                    marginTop: "1rem",
                    padding: "1rem",
                    background:
                      "linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%)",
                    borderRadius: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <i
                      className="bi bi-house-heart"
                      style={{ fontSize: "1.5rem", color: "#6366f1" }}
                    ></i>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "#4b5563",
                        marginBottom: 0,
                        marginTop: "0.25rem",
                      }}
                    >
                      Home Visit
                    </p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <i
                      className="bi bi-clipboard-check"
                      style={{ fontSize: "1.5rem", color: "#6366f1" }}
                    ></i>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "#4b5563",
                        marginBottom: 0,
                        marginTop: "0.25rem",
                      }}
                    >
                      Application
                    </p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <i
                      className="bi bi-heart"
                      style={{ fontSize: "1.5rem", color: "#6366f1" }}
                    ></i>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "#4b5563",
                        marginBottom: 0,
                        marginTop: "0.25rem",
                      }}
                    >
                      Forever Home
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: "center", marginTop: "2rem" }}>
                  <Button
                    variant={isAddedToCart ? "success" : "primary"}
                    onClick={handleCartAction}
                    disabled={
                      addingToCart ||
                      (product?.status || "").toLowerCase() !== "available"
                    }
                    style={{
                      borderRadius: "30px",
                      padding: "0.75rem 2.5rem",
                      fontWeight: "600",
                      background: addingToCart
                        ? "#28a745"
                        : isAddedToCart
                        ? "#10b981"
                        : "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                      border: "none",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
                      opacity: addingToCart ? 0.6 : 1,
                    }}
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
                    {addingToCart
                      ? isAddedToCart
                        ? "Removing..."
                        : "Adding..."
                      : isAddedToCart
                      ? "Added to Cart"
                      : "Add to Cart"}
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Browse all pets section */}
        <div style={{ marginTop: "3rem", textAlign: "center" }}>
          <h3
            style={{
              fontWeight: "700",
              color: "#1f2937",
              marginBottom: "1.5rem",
            }}
          >
            Find More Furry Friends
          </h3>
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate("/find-pet")}
            style={{
              borderRadius: "30px",
              padding: "1rem 3rem",
              fontWeight: "700",
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              border: "none",
              transition: "all 0.3s ease",
              boxShadow: "0 10px 25px rgba(99, 102, 241, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 15px 30px rgba(99, 102, 241, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 10px 25px rgba(99, 102, 241, 0.3)";
            }}
          >
            <i className="bi bi-search-heart me-2"></i>
            Browse All Pets
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default ProductDetails;
