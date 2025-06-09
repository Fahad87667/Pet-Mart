import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import { cartService } from "../services/cartService";
import { getCurrentUser } from "../services/authService";

function Checkout({ onAddToCartSuccess }) {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = location.state?.cart;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    preferredDate: "",
    message: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getCurrentUser();
        if (userData) {
          setFormData((prev) => ({
            ...prev,
            fullName: `${userData.firstName} ${userData.lastName}`.trim(),
            email: userData.email,
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  if (!cart || !cart.cartLines || cart.cartLines.length === 0) {
    navigate("/cart");
    return null;
  }

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      isValid = false;
    } else if (!/^[a-zA-Z\s]{2,50}$/.test(formData.fullName)) {
      newErrors.fullName =
        "Name must be 2-50 characters and contain only letters and spaces";
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    } else if (formData.email.length > 100) {
      newErrors.email = "Email must be less than 100 characters";
      isValid = false;
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^[789]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 10 digits starting with 7, 8 or 9";
      isValid = false;
    }

    // Date validation
    if (!formData.preferredDate) {
      newErrors.preferredDate = "Preferred date is required";
      isValid = false;
    } else {
      const selectedDate = new Date(formData.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.preferredDate = "Please select a future date";
        isValid = false;
      }
    }

    // Message validation (optional)
    if (formData.message && formData.message.length > 500) {
      newErrors.message = "Message must be less than 500 characters";
      isValid = false;
    }

    // Terms validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setValidated(true);
      return;
    }

    setValidated(false);
    setSubmitting(true);
    setSubmissionError(null);

    try {
      // Create CustomerInfo object from form data
      const customerInfo = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        preferredVisitDate: formData.preferredDate,
        message: formData.message,
        address: "N/A",
        valid: true,
      };

      // Call the backend API to create the reservation
      const response = await api.post("/reservations", customerInfo);

      if (response.status === 200) {
        // Clear the cart after successful reservation
        try {
          const updatedCart = await cartService.clearCart();
          if (onAddToCartSuccess) {
            onAddToCartSuccess(updatedCart);
          }
        } catch (error) {
          console.error("Error clearing cart:", error);
        }

        // Reservation created successfully
        toast.success(
          "Reservation submitted successfully! We'll contact you soon.",
          {
            autoClose: 1000,
          }
        );

        // Trigger a custom event to refresh admin dashboard
        const refreshEvent = new CustomEvent("refreshAdminDashboard");
        window.dispatchEvent(refreshEvent);

        // Navigate to a success/status page
        navigate("/reservation-status", {
          state: { status: "PENDING", reservationDetails: response.data },
        });
      } else {
        // Handle other successful but unexpected responses
        toast.error(response.data || "Reservation submission failed.", {
          autoClose: 1000,
        });
        setSubmissionError(response.data || "Reservation submission failed.");
      }
    } catch (error) {
      console.error("Error submitting reservation:", error);
      const errorMessage =
        error.response?.data ||
        error.message ||
        "Failed to submit reservation.";
      setSubmissionError(errorMessage);
      toast.error(errorMessage, {
        autoClose: 1000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #e0e7ff 0%, #f0e6ff 100%)",
        minHeight: "100vh",
        paddingTop: "2rem",
        paddingBottom: "3rem",
      }}
    >
      <Container style={{ maxWidth: "800px" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          Pet Reservation
        </h1>
        <p
          style={{
            textAlign: "center",
            color: "#6b7280",
            marginBottom: "3rem",
          }}
        >
          Reserve your pet and we'll contact you to arrange a visit
        </p>

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
            {/* Pet Summary */}
            <div
              style={{
                marginBottom: "2rem",
                paddingBottom: "2rem",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <h5
                style={{
                  color: "#1f2937",
                  marginBottom: "1rem",
                  fontWeight: "600",
                }}
              >
                Selected Pet{cart.quantityTotal > 1 ? "s" : ""}
              </h5>
              {cart.cartLines.map((item, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                  <img
                    src={
                      item.productInfo.imagePath
                        ? `http://localhost:8080${item.productInfo.imagePath}`
                        : "https://via.placeholder.com/60?text=No+Image"
                    }
                    alt={item.productInfo.name}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      marginRight: "15px",
                    }}
                  />
                  <div>
                    <h6 style={{ margin: 0, color: "#1f2937" }}>
                      {item.productInfo.name}
                    </h6>
                    <small style={{ color: "#6b7280" }}>
                      ${item.productInfo.price.toFixed(2)}
                    </small>
                  </div>
                </div>
              ))}
            </div>

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name (2-50 characters)"
                      minLength={2}
                      maxLength={50}
                      readOnly
                      style={{
                        borderRadius: "10px",
                        borderColor: errors.fullName ? "#dc3545" : undefined,
                        backgroundColor: "#f8f9fa",
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.fullName || "Please provide your name."}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      maxLength={100}
                      readOnly
                      style={{
                        borderRadius: "10px",
                        borderColor: errors.email ? "#dc3545" : undefined,
                        backgroundColor: "#f8f9fa",
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email || "Please provide a valid email."}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="8XXXXXXXXX or 9XXXXXXXXX"
                      pattern="[89]\d{9}"
                      style={{
                        borderRadius: "10px",
                        borderColor: errors.phone ? "#dc3545" : undefined,
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.phone || "Please provide a valid phone number."}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Preferred Visit Date</Form.Label>
                <Form.Control
                  required
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split("T")[0]}
                  style={{
                    borderRadius: "10px",
                    borderColor: errors.preferredDate ? "#dc3545" : undefined,
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.preferredDate || "Please select a visit date."}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Message (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us anything else you'd like us to know... (max 500 characters)"
                  maxLength={500}
                  style={{
                    borderRadius: "10px",
                    borderColor: errors.message ? "#dc3545" : undefined,
                  }}
                />
                {errors.message && (
                  <Form.Control.Feedback type="invalid">
                    {errors.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              <Alert
                variant="info"
                style={{ borderRadius: "10px", fontSize: "14px" }}
              >
                <strong>Note:</strong> This is a reservation only. Our team will
                contact you within 24 hours to schedule your visit and discuss
                the adoption process.
              </Alert>

              <Form.Group className="mb-4">
                <Form.Check
                  required
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  label="I understand this is a reservation request and agree to be contacted"
                  feedback={
                    errors.agreeToTerms || "You must agree before submitting."
                  }
                  feedbackType="invalid"
                  isInvalid={!!errors.agreeToTerms}
                />
              </Form.Group>

              <div className="d-flex gap-3 justify-content-center">
                <Button
                  variant="secondary"
                  onClick={() => navigate("/cart")}
                  style={{
                    borderRadius: "25px",
                    padding: "0.75rem 2rem",
                    fontWeight: "600",
                  }}
                >
                  Back to Cart
                </Button>
                <Button
                  type="submit"
                  disabled={!formData.agreeToTerms || submitting}
                  style={{
                    background:
                      !formData.agreeToTerms || submitting
                        ? "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)"
                        : "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                    border: "none",
                    borderRadius: "25px",
                    padding: "0.75rem 2rem",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
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
                  Submit Reservation
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default Checkout;
