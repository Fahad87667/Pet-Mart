import React, { useState, useEffect } from "react";
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
  ProgressBar,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/authService";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaUserShield,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaKey,
  FaCheckCircle,
  FaTimesCircle,
  FaPaw,
} from "react-icons/fa";
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
    } else if (!/^[a-zA-Z\s]*$/.test(formData.firstName)) {
      errors.firstName = "First name can only contain letters";
      isValid = false;
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
      isValid = false;
    } else if (formData.lastName.length < 2) {
      errors.lastName = "Last name must be at least 2 characters";
      isValid = false;
    } else if (!/^[a-zA-Z\s]*$/.test(formData.lastName)) {
      errors.lastName = "Last name can only contain letters";
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
    if (userType === "admin" && !formData.secretKey.trim()) {
      errors.secretKey = "Secret key is required for admin registration";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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
        toast.success("Welcome to Pet-Mart! 🎉", {
          autoClose: 1500,
          position: "top-center",
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

    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: "" });
    }
  };

  const handleUserTypeChange = (val) => {
    setUserType(val);
    setFormData({ ...formData, secretKey: "" });
    setValidationErrors({ ...validationErrors, secretKey: "" });
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      padding: "2rem 0",
      position: "relative",
      overflow: "hidden",
    },
    backgroundPattern: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.1,
      background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    },
    card: {
      borderRadius: "25px",
      border: "none",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
      padding: "2.5rem",
      margin: "0 auto",
      background: "rgba(255, 255, 255, 0.98)",
      backdropFilter: "blur(20px)",
      animation: "slideIn 0.6s ease-out",
    },
    logo: {
      width: "80px",
      height: "80px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 1.5rem",
      fontSize: "2.5rem",
      color: "white",
      boxShadow: "0 10px 30px rgba(102, 126, 234, 0.4)",
    },
    title: {
      fontSize: "2.5rem",
      fontWeight: "700",
      textAlign: "center",
      marginBottom: "0.5rem",
      color: "#1a202c",
      fontFamily: "'Poppins', sans-serif",
    },
    subtitle: {
      textAlign: "center",
      fontSize: "1rem",
      color: "#718096",
      marginBottom: "2rem",
      fontFamily: "'Inter', sans-serif",
    },
    input: {
      border: "2px solid #e2e8f0",
      borderRadius: "12px",
      padding: "0.75rem 1rem 0.75rem 3rem",
      transition: "all 0.3s ease",
      backgroundColor: "#f7fafc",
      fontSize: "1rem",
      fontFamily: "'Inter', sans-serif",
    },
    inputIcon: {
      position: "absolute",
      left: "1rem",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#667eea",
      fontSize: "1.1rem",
      zIndex: 2,
    },
    errorText: {
      color: "#ef4444",
      fontSize: "0.875rem",
      marginTop: "0.25rem",
      display: "flex",
      alignItems: "center",
      gap: "0.25rem",
    },
    formControl: {
      borderRadius: "12px",
      padding: "0.75rem 1.25rem",
      fontSize: "1rem",
      border: "1px solid #ced4da",
      transition:
        "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
    },
    inputGroupText: {
      borderRadius: "12px 0 0 12px",
      backgroundColor: "#e9ecef",
      border: "1px solid #ced4da",
      borderRight: "none",
      padding: "0.75rem 1.25rem",
    },
    button: {
      borderRadius: "25px",
      padding: "0.75rem 2rem",
      fontWeight: "600",
      fontSize: "1.1rem",
      marginTop: "1.5rem",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      border: "none",
      boxShadow: "0 8px 20px rgba(118, 75, 162, 0.3)",
      transition: "all 0.3s ease",
    },
    buttonHover: {
      background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
      boxShadow: "0 12px 30px rgba(118, 75, 162, 0.4)",
      transform: "translateY(-2px)",
    },
    toggleButton: {
      borderRadius: "25px",
      padding: "0.5rem 1.5rem",
      margin: "0 0.5rem",
      fontWeight: "600",
      border: "1px solid #667eea",
      color: "#667eea",
      backgroundColor: "transparent",
      transition: "all 0.3s ease",
    },
    toggleButtonActive: {
      backgroundColor: "#667eea",
      color: "white",
      boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
    },
    alert: {
      borderRadius: "12px",
      marginTop: "1.5rem",
    },
    signinLink: {
      marginTop: "1.5rem",
      textAlign: "center",
      color: "#1f2937",
    },
    link: {
      color: "#667eea",
      fontWeight: "600",
      textDecoration: "none",
    },
    linkHover: {
      textDecoration: "underline",
    },
    eyeButton: {
      borderLeft: "none",
      borderRadius: "0 12px 12px 0",
    },
  };

  // Add CSS for animations
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(-30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-10px);
        }
        60% {
          transform: translateY(-5px);
        }
      }
      
      .register-button:hover {
        background: linear-gradient(135deg, #764ba2 0%, #667eea 100%) !important;
        box-shadow: 0 12px 30px rgba(118, 75, 162, 0.4) !important;
        transform: translateY(-2px);
      }
      
      .toggle-button:hover {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
        transform: translateY(-3px);
        box-shadow: 0 6px 15px rgba(118, 75, 162, 0.25);
        border-color: #764ba2;
      }
      
      .toggle-button.active {
        background-color: #667eea !important;
        color: white !important;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      }
      
      .signin-link a:hover {
        text-decoration: underline;
      }
      
      @media (max-width: 576px) {
        .register-card {
          padding: 1.5rem !important;
          max-width: 95vw;
        }
      }
      
      @media (min-width: 577px) and (max-width: 768px) {
        .register-card {
          max-width: 85vw;
        }
      }
      
      @media (min-width: 769px) and (max-width: 992px) {
        .register-card {
          max-width: 75vw;
        }
      }
      
      @media (min-width: 993px) {
        .register-card {
          max-width: 700px;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.backgroundPattern}></div>
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={12} sm={10} md={8} lg={6}>
            <Card style={styles.card} className="register-card">
              <Card.Body>
                <div style={styles.logo}>
                  <FaPaw size={40} color="white" />
                </div>
                <Card.Title style={styles.title}>Register</Card.Title>

                {error && (
                  <Alert variant="danger" style={styles.alert}>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="userType" className="mb-3 text-center">
                    <Form.Label
                      style={{
                        fontWeight: "600",
                        marginBottom: "1rem",
                        color: "#4b5563",
                      }}
                    >
                      Register as:
                    </Form.Label>
                    <br />
                    <ToggleButtonGroup
                      type="radio"
                      name="userType"
                      value={userType}
                      onChange={handleUserTypeChange}
                    >
                      <ToggleButton
                        id="tbg-radio-1"
                        value={"user"}
                        style={
                          userType === "user"
                            ? {
                                ...styles.toggleButton,
                                ...styles.toggleButtonActive,
                              }
                            : styles.toggleButton
                        }
                        className="toggle-button"
                      >
                        User <FaUser size={18} className="ms-2" />
                      </ToggleButton>
                      <ToggleButton
                        id="tbg-radio-2"
                        value={"admin"}
                        style={
                          userType === "admin"
                            ? {
                                ...styles.toggleButton,
                                ...styles.toggleButtonActive,
                              }
                            : styles.toggleButton
                        }
                        className="toggle-button"
                      >
                        Admin <FaUserShield size={18} className="ms-2" />
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Form.Group>

                  <Form.Group controlId="firstName" className="mb-3">
                    <Form.Label style={{ fontWeight: "500" }}>
                      First Name
                    </Form.Label>
                    <InputGroup hasValidation>
                      <InputGroup.Text style={styles.inputGroupText}>
                        <FaUser />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Enter first name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        isInvalid={!!validationErrors.firstName}
                        style={styles.formControl}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.firstName}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group controlId="lastName" className="mb-3">
                    <Form.Label style={{ fontWeight: "500" }}>
                      Last Name
                    </Form.Label>
                    <InputGroup hasValidation>
                      <InputGroup.Text style={styles.inputGroupText}>
                        <FaUser />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Enter last name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        isInvalid={!!validationErrors.lastName}
                        style={styles.formControl}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.lastName}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group controlId="email" className="mb-3">
                    <Form.Label style={{ fontWeight: "500" }}>
                      Email address
                    </Form.Label>
                    <InputGroup hasValidation>
                      <InputGroup.Text style={styles.inputGroupText}>
                        <FaEnvelope />
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        placeholder="Enter email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        isInvalid={!!validationErrors.email}
                        style={styles.formControl}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.email}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group controlId="phone" className="mb-3">
                    <Form.Label style={{ fontWeight: "500" }}>
                      Phone Number
                    </Form.Label>
                    <InputGroup hasValidation>
                      <InputGroup.Text style={styles.inputGroupText}>
                        <FaPhone />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Enter phone number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        isInvalid={!!validationErrors.phone}
                        style={styles.formControl}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.phone}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group controlId="password" className="mb-3">
                    <Form.Label style={{ fontWeight: "500" }}>
                      Password
                    </Form.Label>
                    <InputGroup hasValidation>
                      <InputGroup.Text style={styles.inputGroupText}>
                        <FaLock />
                      </InputGroup.Text>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        isInvalid={!!validationErrors.password}
                        style={styles.formControl}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                        style={styles.eyeButton}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.password}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group controlId="confirmPassword" className="mb-3">
                    <Form.Label style={{ fontWeight: "500" }}>
                      Confirm Password
                    </Form.Label>
                    <InputGroup hasValidation>
                      <InputGroup.Text style={styles.inputGroupText}>
                        <FaLock />
                      </InputGroup.Text>
                      <Form.Control
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        isInvalid={!!validationErrors.confirmPassword}
                        style={styles.formControl}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        style={styles.eyeButton}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.confirmPassword}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  {userType === "admin" && (
                    <Form.Group controlId="secretKey" className="mb-3">
                      <Form.Label style={{ fontWeight: "500" }}>
                        Secret Key
                      </Form.Label>
                      <InputGroup hasValidation>
                        <InputGroup.Text style={styles.inputGroupText}>
                          <FaKey />
                        </InputGroup.Text>
                        <Form.Control
                          type={showSecretKey ? "text" : "password"}
                          placeholder="Enter secret key"
                          name="secretKey"
                          value={formData.secretKey}
                          onChange={handleChange}
                          isInvalid={!!validationErrors.secretKey}
                          style={styles.formControl}
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setShowSecretKey(!showSecretKey)}
                          style={styles.eyeButton}
                        >
                          {showSecretKey ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                        <Form.Control.Feedback type="invalid">
                          {validationErrors.secretKey}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  )}

                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    className="w-100 register-button"
                    style={styles.button}
                  >
                    {loading ? "Registering..." : "Register"}
                  </Button>
                </Form>

                <div style={styles.signinLink} className="signin-link">
                  Already have an account?{" "}
                  <Link to="/signin" style={styles.link}>
                    Sign In
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Register;
