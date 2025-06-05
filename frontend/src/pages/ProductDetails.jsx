import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Badge, Spinner } from "react-bootstrap";
import { productService } from "../services/productService";

function ProductDetails() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productService.getProduct(code);
        setProduct(response);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [code]);

  const getTypeBadgeColor = (type) => {
    const colors = { DOG: "#3b82f6", CAT: "#f59e0b", BIRD: "#10b981" };
    return colors[type] || "#6366f1";
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
        <Spinner animation="border" variant="primary" />
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
            borderRadius: "20px",
            border: "none",
            boxShadow: "0 10px 30px rgba(99, 102, 241, 0.1)",
            padding: "2rem",
          }}
        >
          <Card.Body className="text-center">
            <h3 style={{ color: "#e74c3c", marginBottom: "1rem" }}>
              Oops! Something went wrong
            </h3>
            <p style={{ color: "#34495e" }}>{error}</p>
            <Button
              variant="primary"
              onClick={() => navigate("/find-pet")}
              style={{
                borderRadius: "25px",
                padding: "0.75rem 2rem",
                fontWeight: "600",
                background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                border: "none",
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
        padding: "3rem 0",
      }}
    >
      <Container>
        <Button
          variant="outline-primary"
          onClick={() => navigate("/find-pet")}
          style={{
            borderRadius: "25px",
            padding: "0.75rem 2rem",
            fontWeight: "600",
            marginBottom: "2rem",
            borderColor: "#6366f1",
            color: "#6366f1",
          }}
        >
          ← Back to Find Pet
        </Button>

        <Card
          style={{
            background: "white",
            borderRadius: "20px",
            border: "none",
            boxShadow: "0 10px 30px rgba(99, 102, 241, 0.1)",
            overflow: "hidden",
          }}
        >
          <Row className="g-0">
            <Col md={6}>
              <div
                style={{
                  height: "100%",
                  minHeight: "500px",
                  position: "relative",
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
                  bg=""
                  style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    background: getTypeBadgeColor(product.type),
                    padding: "0.75rem 1.5rem",
                    borderRadius: "25px",
                    fontSize: "1rem",
                    fontWeight: "600",
                  }}
                >
                  {product.type}
                </Badge>
              </div>
            </Col>
            <Col md={6}>
              <Card.Body
                style={{
                  padding: "3rem",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h1
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "700",
                    color: "#1f2937",
                    marginBottom: "1rem",
                  }}
                >
                  {product.name}
                </h1>

                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "#6366f1",
                    marginBottom: "2rem",
                  }}
                >
                  ₹{product.price?.toFixed(2) || "0.00"}
                </div>

                <div style={{ marginBottom: "2rem" }}>
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      color: "#4b5563",
                      marginBottom: "1rem",
                    }}
                  >
                    About
                  </h3>
                  <p
                    style={{
                      color: "#6b7280",
                      fontSize: "1.1rem",
                      lineHeight: "1.6",
                    }}
                  >
                    {product.description}
                  </p>
                </div>

                <div style={{ marginBottom: "2rem" }}>
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      color: "#4b5563",
                      marginBottom: "1rem",
                    }}
                  >
                    Details
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          color: "#6b7280",
                          fontSize: "0.9rem",
                          marginBottom: "0.25rem",
                        }}
                      >
                        Breed
                      </p>
                      <p
                        style={{
                          color: "#1f2937",
                          fontSize: "1.1rem",
                          fontWeight: "500",
                        }}
                      >
                        {product.breed}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          color: "#6b7280",
                          fontSize: "0.9rem",
                          marginBottom: "0.25rem",
                        }}
                      >
                        Age
                      </p>
                      <p
                        style={{
                          color: "#1f2937",
                          fontSize: "1.1rem",
                          fontWeight: "500",
                        }}
                      >
                        {product.age}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          color: "#6b7280",
                          fontSize: "0.9rem",
                          marginBottom: "0.25rem",
                        }}
                      >
                        Gender
                      </p>
                      <p
                        style={{
                          color: "#1f2937",
                          fontSize: "1.1rem",
                          fontWeight: "500",
                        }}
                      >
                        {product.gender}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          color: "#6b7280",
                          fontSize: "0.9rem",
                          marginBottom: "0.25rem",
                        }}
                      >
                        Status
                      </p>
                      <p
                        style={{
                          color: "#1f2937",
                          fontSize: "1.1rem",
                          fontWeight: "500",
                        }}
                      >
                        {product.status}
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "auto" }}>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate("/find-pet")}
                    style={{
                      width: "100%",
                      borderRadius: "25px",
                      padding: "1rem",
                      fontWeight: "600",
                      background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                      border: "none",
                    }}
                  >
                    Back to Find Pet
                  </Button>
                </div>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </Container>
    </div>
  );
}

export default ProductDetails;
