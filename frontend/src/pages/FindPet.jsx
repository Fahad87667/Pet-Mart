import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { productService } from "../services/productService";
import { cartService } from "../services/cartService";
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";

function FindPet({ onAddToCartSuccess, isAdmin }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const user = await getCurrentUser();
        setIsLoggedIn(!!user);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, []);

  const handleEdit = (productCode) => {
    navigate(`/admin?edit=${productCode}`);
  };

  const fetchCart = async () => {
    try {
      const data = await cartService.getCart();
      const codesInCart = data?.cartLines?.map((item) => item.productInfo.code) || [];
      setCartItems(codesInCart);
    } catch (err) {
      console.error("Error fetching cart in FindPet:", err);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getProducts();
        const allProducts = response.items || [];

        // Filter only products with status 'available'
        const availableProducts = allProducts.filter(
          (product) => product.status?.toLowerCase() === "available"
        );

        setProducts(availableProducts);
        setFilteredProducts(availableProducts);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    if (!isAdmin) {
      fetchCart();
    }
  }, [isAdmin]);

  useEffect(() => {
    let filtered = products;

    if (selectedType !== "ALL") {
      filtered = filtered.filter((product) => product.type === selectedType);
    }

    if (searchTerm) {
      filtered = filtered.filter((product) => {
        const name = product.name ?? "";
        const description = product.description ?? "";
        return (
          name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedType]);

  const handleAddToCartSuccess = async (updatedCart) => {
    if (onAddToCartSuccess) {
      onAddToCartSuccess();
    }
    await fetchCart();
  };

  const petTypes = ["ALL", "DOG", "CAT", "BIRD"];

  if (error) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 116px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            background: "white",
            borderRadius: "15px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ color: "#e74c3c", marginBottom: "1rem" }}>
            Oops! Something went wrong
          </h3>
          <p style={{ color: "#34495e" }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #e0e7ff 0%, #f0e6ff 100%)",
        minHeight: "100vh",
        paddingTop: "2rem",
        paddingBottom: "3rem",
      }}
    >
      <Container>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "1rem",
            }}
          >
            {isAdmin ? "Manage Pets" : "Find Your Perfect Companion 🐾"}
          </h1>
          <p style={{ fontSize: "1.2rem", color: "#6b7280" }}>
            {isAdmin ? "Edit and manage available pets" : "Discover loving pets waiting for their forever homes"}
          </p>
        </div>

        {/* Search and Filter Section */}
        <Row className="mb-5">
          <Col lg={8} className="mx-auto">
            <div
              style={{
                background: "white",
                padding: "1.5rem",
                borderRadius: "15px",
                boxShadow: "0 8px 25px rgba(99, 102, 241, 0.08)",
              }}
            >
              <Row className="g-3">
                <Col md={8}>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Search for your perfect pet..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        border: "2px solid #e5e7eb",
                        borderRadius: "10px 0 0 10px",
                        padding: "0.75rem",
                        transition: "all 0.2s ease",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#6366f1";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(99, 102, 241, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e5e7eb";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    <Button
                      variant="outline-secondary"
                      style={{
                        border: "2px solid #e5e7eb",
                        borderLeft: "none",
                        borderRadius: "0 10px 10px 0",
                        padding: "0.75rem 1rem",
                        transition: "all 0.2s ease",
                      }}
                    >
                      🔍
                    </Button>
                  </InputGroup>
                </Col>
                <Col md={4}>
                  <Form.Select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    style={{
                      border: "2px solid #e5e7eb",
                      borderRadius: "10px",
                      padding: "0.75rem",
                      transition: "all 0.2s ease",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#6366f1";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(99, 102, 241, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e5e7eb";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    {petTypes.map((type) => (
                      <option key={type} value={type}>
                        {type === "ALL" ? "All Pets" : `${type}S`}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        {/* Products Grid or Empty State */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem 0" }}>
            <Spinner animation="border" variant="primary" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <Row className="g-4">
            {filteredProducts.map((product) => (
              <Col key={product.code} sm={6} md={4} lg={3} className="mb-4">
                <ProductCard
                  product={product}
                  onAddToCartSuccess={handleAddToCartSuccess}
                  isAddedToCart={cartItems.includes(product.code)}
                  isAdmin={isAdmin}
                  isLoggedIn={isLoggedIn}
                  onEdit={handleEdit}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center">
            <div
              style={{
                maxWidth: "600px",
                margin: "0 auto",
                padding: "2rem",
                background: "white",
                borderRadius: "15px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ color: "#6366f1", marginBottom: "1.5rem" }}>
                Sorry, We Are Out of Stock
              </h3>
              <p style={{ fontSize: "1.1rem", marginBottom: "2rem" }}>
                We're working hard to bring you more adorable companions. 
                Please check back later or visit our store to see our available pets!
              </p>
              <img
                src="https://images.unsplash.com/photo-1583511655826-05700d52f4d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Sad pet"
                style={{
                  borderRadius: "10px",
                  maxWidth: "100%",
                  height: "300px",
                  objectFit: "cover",
                  marginBottom: "2rem",
                }}
              />
              <Button
                variant="primary"
                size="lg"
                className="mt-4 d-block mx-auto"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedType("ALL");
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

export default FindPet;