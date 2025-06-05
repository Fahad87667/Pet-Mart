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
      toast.success("Cart updated successfully!");
    } catch (err) {
      console.error("Error updating quantity:", err);
      toast.error("Failed to update item quantity.");
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
      toast.success("Item removed from cart!");
    } catch (err) {
      console.error("Error removing item:", err);
      if (err.message === "AUTHENTICATION_REQUIRED") {
        toast.error("Please sign in to manage your cart");
        navigate("/signin");
      } else {
        toast.error("Failed to remove item from cart.");
        setError(err.message || "Failed to remove item from cart.");
      }
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
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
          <div style={{ fontSize: "4rem" }}>🛒</div>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "700",
              color: "#4b5563",
              marginTop: "1rem",
            }}
          >
            Your Cart is Empty
          </h1>
          <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button
            variant="primary"
            href="/find-pet"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              border: "none",
              borderRadius: "25px",
              padding: "0.75rem 2rem",
              fontWeight: "600",
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
            Find Your Pet
          </Button>
        </Container>
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
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "2rem",
          }}
        >
          Your Shopping Cart
        </h1>

        <Row>
          <Col lg={8}>
            <Card
              style={{
                background: "white",
                borderRadius: "20px",
                border: "none",
                boxShadow: "0 10px 30px rgba(99, 102, 241, 0.1)",
                padding: "2rem",
              }}
            >
              <Card.Body>
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.cartLines.map((item, index) => (
                      <tr key={`${item.productCode}-${index}`}>
                        <td>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Image
                              src={
                                item.productInfo.imagePath
                                  ? `http://localhost:8080${item.productInfo.imagePath}`
                                  : "https://via.placeholder.com/100?text=No+Image"
                              }
                              roundedCircle
                              style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                                marginRight: "15px",
                                borderRadius: "10px",
                              }}
                            />
                            <span
                              style={{ fontWeight: "600", color: "#4b5563" }}
                            >
                              {item.productInfo.name}
                            </span>
                          </div>
                        </td>
                        <td className="text-end">
                          ₹{item.productInfo.price.toFixed(2)}
                        </td>
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() =>
                              handleRemoveItem(item.productInfo.code)
                            }
                            style={{
                              borderRadius: "5px",
                              padding: "0.25rem 0.5rem",
                            }}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card
              style={{
                background: "white",
                borderRadius: "20px",
                border: "none",
                boxShadow: "0 10px 30px rgba(99, 102, 241, 0.1)",
                padding: "1.5rem",
              }}
            >
              <Card.Body>
                <h5
                  style={{
                    fontWeight: "700",
                    marginBottom: "1.5rem",
                    color: "#1f2937",
                  }}
                >
                  Order Summary
                </h5>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "1.1rem",
                    marginBottom: "1rem",
                    color: "#4b5563",
                  }}
                >
                  <span>Subtotal ({cart.quantityTotal} items):</span>
                  <span style={{ fontWeight: "600" }}>
                    ${cart.amountTotal.toFixed(2)}
                  </span>
                </div>
                <hr style={{ margin: "1.5rem 0" }} />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "1.4rem",
                    fontWeight: "700",
                    color: "#1f2937",
                    marginBottom: "2rem",
                  }}
                >
                  <span>Order Total:</span>
                  <span className="text-end fw-bold">
                    ₹{cart.amountTotal.toFixed(2)}
                  </span>
                </div>
                <div className="total-amount">
                  Total Amount: ₹{cart.amountTotal.toFixed(2)}
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate("/checkout", { state: { cart } })}
                  style={{
                    background:
                      "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                    border: "none",
                    borderRadius: "25px",
                    padding: "0.75rem 2rem",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
                    width: "100%",
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
                  Proceed to Checkout
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Cart;
