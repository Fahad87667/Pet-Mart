import React, { useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  Alert,
  InputGroup,
  ToggleButtonGroup,
  ToggleButton,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import { FaEye, FaEyeSlash, FaUser, FaUserShield } from "react-icons/fa";
import { toast } from "react-toastify";

function Register({ updateAuthState }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    secretKey: "",
  });
  const [userType, setUserType] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    secretKey: "",
  });

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // First Name validation
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
      isValid = false;
    } else if (formData.firstName.length < 2) {
      errors.firstName = "First name must be at least 2 characters";
      isValid = false;
    } else if (formData.firstName.length > 50) {
      errors.firstName = "First name must not exceed 50 characters";
      isValid = false;
    } else if (!/^[a-zA-Z\s]*$/.test(formData.firstName)) {
      errors.firstName = "First name can only contain letters and spaces";
      isValid = false;
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
      isValid = false;
    } else if (formData.lastName.length < 2) {
      errors.lastName = "Last name must be at least 2 characters";
      isValid = false;
    } else if (formData.lastName.length > 50) {
      errors.lastName = "Last name must not exceed 50 characters";
      isValid = false;
    } else if (!/^[a-zA-Z\s]*$/.test(formData.lastName)) {
      errors.lastName = "Last name can only contain letters and spaces";
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = "Please enter a valid email address";
        isValid = false;
      } else if (formData.email.length > 100) {
        errors.email = "Email must not exceed 100 characters";
        isValid = false;
      }
    }

    // Phone validation
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^[8-9]\d{9}$/.test(formData.phone)) {
      errors.phone = "Phone must be 10 digits starting with 8 or 9";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
      isValid = false;
    } else if (formData.password.length > 50) {
      errors.password = "Password must not exceed 50 characters";
      isValid = false;
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      errors.password = "Password must contain at least one lowercase letter";
      isValid = false;
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      errors.password = "Password must contain at least one uppercase letter";
      isValid = false;
    } else if (!/(?=.*\d)/.test(formData.password)) {
      errors.password = "Password must contain at least one number";
      isValid = false;
    } else if (!/(?=.*[@$!%*?&])/.test(formData.password)) {
      errors.password = "Password must contain at least one special character (@$!%*?&)";
      isValid = false;
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    // Secret Key validation (only for admin)
    if (userType === "admin") {
      if (!formData.secretKey.trim()) {
        errors.secretKey = "Secret key is required for admin registration";
        isValid = false;
      } else if (formData.secretKey.trim() !== "ADMIN123") {
        errors.secretKey = "Invalid secret key";
        isValid = false;
      }
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: userType === "admin" ? "ADMIN" : "USER",
        secretKey: formData.secretKey,
      };

      const user = await register(userData);
      if (user) {
        updateAuthState(user);
        toast.success("Registered successfully!", {
          autoClose: 1000,
        });
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: "",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const toggleSecretKeyVisibility = () => {
    setShowSecretKey(!showSecretKey);
  };

  const handleUserTypeChange = (val) => {
    setUserType(val);
    // Clear secret key when switching user types
    setFormData({ ...formData, secretKey: "" });
    setValidationErrors({ ...validationErrors, secretKey: "" });
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e0e7ff 0%, #f0e6ff 100%)",
      display: "flex",
      alignItems: "center",
      padding: "2rem 0",
    },
    card: {
      borderRadius: "25px",
      border: "none",
      boxShadow: "0 15px 35px rgba(99, 102, 241, 0.2)",
      padding: "2.5rem",
      maxWidth: "600px",
      margin: "0 auto",
    },
    logo: {
      width: "70px",
      height: "70px",
      background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
      borderRadius: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 1.5rem",
      fontSize: "2rem",
      boxShadow: "0 8px 25px rgba(99, 102, 241, 0.3)",
    },
    title: {
      fontSize: "2rem",
      fontWeight: "700",
      textAlign: "center",
      marginBottom: "2rem",
      background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    input: {
      border: "2px solid #e5e7eb",
      borderRadius: "12px",
      padding: "0.75rem 1rem",
      transition: "all 0.3s ease",
    },
    inputError: {
      border: "2px solid #ef4444",
    },
    errorText: {
      color: "#ef4444",
      fontSize: "0.875rem",
      marginTop: "0.25rem",
    },
    button: {
      background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
      border: "none",
      borderRadius: "25px",
      padding: "0.75rem",
      fontSize: "1.1rem",
      fontWeight: "600",
      width: "100%",
      boxShadow: "0 6px 20px rgba(99, 102, 241, 0.3)",
      transition: "all 0.3s ease",
    },
    passwordToggle: {
      cursor: "pointer",
      position: "absolute",
      right: "10px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#9ca3af",
    },
    toggleGroup: {
      width: "100%",
      marginBottom: "1.5rem",
      borderRadius: "12px",
      overflow: "hidden",
      border: "2px solid #e5e7eb",
    },
    toggleButton: {
      width: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
    },
  };

  return (
    <div style={styles.container}>
      <Container>
        <Card style={styles.card}>
          <div style={styles.logo}>🐾</div>
          <h2 style={styles.title}>Create Account</h2>

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          <ToggleButtonGroup
            type="radio"
            name="userType"
            value={userType}
            onChange={handleUserTypeChange}
            style={styles.toggleGroup}
          >
            <ToggleButton
              id="tbg-btn-1"
              value="user"
              variant={userType === "user" ? "primary" : "outline-secondary"}
              style={styles.toggleButton}
            >
              <FaUser /> User
            </ToggleButton>
            <ToggleButton
              id="tbg-btn-2"
              value="admin"
              variant={userType === "admin" ? "primary" : "outline-secondary"}
              style={styles.toggleButton}
            >
              <FaUserShield /> Admin
            </ToggleButton>
          </ToggleButtonGroup>

          <Form onSubmit={handleSubmit} noValidate>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: "600", color: "#4b5563" }}>
                    First Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      ...(validationErrors.firstName && styles.inputError),
                    }}
                    isInvalid={!!validationErrors.firstName}
                    required
                    minLength={2}
                    maxLength={50}
                    placeholder="Enter your first name"
                  />
                  {validationErrors.firstName && (
                    <Form.Text style={styles.errorText}>
                      {validationErrors.firstName}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: "600", color: "#4b5563" }}>
                    Last Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      ...(validationErrors.lastName && styles.inputError),
                    }}
                    isInvalid={!!validationErrors.lastName}
                    required
                    minLength={2}
                    maxLength={50}
                    placeholder="Enter your last name"
                  />
                  {validationErrors.lastName && (
                    <Form.Text style={styles.errorText}>
                      {validationErrors.lastName}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: "600", color: "#4b5563" }}>
                Email
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(validationErrors.email && styles.inputError),
                }}
                isInvalid={!!validationErrors.email}
                required
                maxLength={100}
                placeholder="example@gmail.com"
              />
              {validationErrors.email && (
                <Form.Text style={styles.errorText}>
                  {validationErrors.email}
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: "600", color: "#4b5563" }}>
                Phone
              </Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(validationErrors.phone && styles.inputError),
                }}
                isInvalid={!!validationErrors.phone}
                required
                maxLength="10"
                placeholder="e.g. 9876543210"
              />
              {validationErrors.phone && (
                <Form.Text style={styles.errorText}>
                  {validationErrors.phone}
                </Form.Text>
              )}
            </Form.Group>

            {userType === "admin" && (
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: "600", color: "#4b5563" }}>
                  Secret Key
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showSecretKey ? "text" : "password"}
                    name="secretKey"
                    value={formData.secretKey}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      ...(validationErrors.secretKey && styles.inputError),
                    }}
                    isInvalid={!!validationErrors.secretKey}
                    required={userType === "admin"}
                    placeholder="Enter admin secret key"
                  />
                  <InputGroup.Text
                    style={styles.passwordToggle}
                    onClick={toggleSecretKeyVisibility}
                  >
                    {showSecretKey ? <FaEyeSlash /> : <FaEye />}
                  </InputGroup.Text>
                </InputGroup>
                {validationErrors.secretKey ? (
                  <Form.Text style={styles.errorText}>
                    {validationErrors.secretKey}
                  </Form.Text>
                ) : (
                  <Form.Text style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                    Required for admin registration
                  </Form.Text>
                )}
              </Form.Group>
            )}

            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label style={{ fontWeight: "600", color: "#4b5563" }}>
                    Password
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      style={{
                        ...styles.input,
                        ...(validationErrors.password && styles.inputError),
                      }}
                      isInvalid={!!validationErrors.password}
                      required
                      minLength={8}
                      maxLength={50}
                      placeholder="Enter your password"
                    />
                    <InputGroup.Text
                      style={styles.passwordToggle}
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </InputGroup.Text>
                  </InputGroup>
                  {validationErrors.password ? (
                    <Form.Text style={styles.errorText}>
                      {validationErrors.password}
                    </Form.Text>
                  ) : (
                    <Form.Text style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                      Must contain: uppercase, lowercase, number, special character
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label style={{ fontWeight: "600", color: "#4b5563" }}>
                    Confirm Password
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      style={{
                        ...styles.input,
                        ...(validationErrors.confirmPassword && styles.inputError),
                      }}
                      isInvalid={!!validationErrors.confirmPassword}
                      required
                      minLength={8}
                      maxLength={50}
                      placeholder="Confirm your password"
                    />
                    <InputGroup.Text
                      style={styles.passwordToggle}
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </InputGroup.Text>
                  </InputGroup>
                  {validationErrors.confirmPassword && (
                    <Form.Text style={styles.errorText}>
                      {validationErrors.confirmPassword}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Button
              type="submit"
              style={styles.button}
              disabled={loading}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 8px 25px rgba(99, 102, 241, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 6px 20px rgba(99, 102, 241, 0.3)";
                }
              }}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>

            <div className="text-center mt-4">
              <span style={{ color: "#6b7280" }}>Already have an account? </span>
              <a
                onClick={() => navigate("/signin")}
                style={{
                  color: "#6366f1",
                  textDecoration: "none",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                Sign in
              </a>
            </div>
          </Form>
        </Card>
      </Container>
    </div>
  );
}

export default Register;
