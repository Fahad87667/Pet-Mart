import React, { useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  InputGroup,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaPaw } from "react-icons/fa";
import "./style.css";

function SignIn({ updateAuthState }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Validation function
  const validate = () => {
    let valid = true;
    let tempErrors = { email: "", password: "" };

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      tempErrors.email = "Email is required";
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = "Enter a valid email address";
      valid = false;
    }

    // Password validation (min 6 chars)
    if (!formData.password) {
      tempErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    setLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      if (user) {
        updateAuthState(user);
        toast.success("Welcome back! 🎉", {
          autoClose: 1500,
          position: "top-center",
        });
        navigate("/");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const signinContainerStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "2rem 0",
    position: "relative",
    overflow: "hidden",
  };

  const backgroundPatternStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  };

  const cardStyle = {
    maxWidth: "450px",
    width: "100%",
    margin: "0 auto",
    borderRadius: "25px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    overflow: "hidden",
    background: "rgba(255, 255, 255, 0.98)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    animation: "slideIn 0.6s ease-out",
  };

  const cardBodyStyle = {
    padding: "3rem",
  };

  const logoStyle = {
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
    animation: "bounce 2s infinite",
  };

  const titleStyle = {
    textAlign: "center",
    fontSize: "2rem",
    fontWeight: "700",
    color: "#1a202c",
    marginBottom: "0.5rem",
    fontFamily: "'Poppins', sans-serif",
  };

  const subtitleStyle = {
    textAlign: "center",
    fontSize: "1rem",
    color: "#718096",
    marginBottom: "2rem",
    fontFamily: "'Inter', sans-serif",
  };

  const inputGroupStyle = {
    position: "relative",
    marginBottom: "1.5rem",
  };

  const inputIconStyle = {
    position: "absolute",
    left: "1rem",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#667eea",
    zIndex: 2,
    fontSize: "1.1rem",
  };

  const inputStyle = {
    paddingLeft: "3rem",
    paddingRight: showPassword ? "3rem" : "1rem",
    height: "50px",
    borderRadius: "12px",
    border: "2px solid #e2e8f0",
    fontSize: "1rem",
    fontFamily: "'Inter', sans-serif",
    transition: "all 0.3s ease",
    backgroundColor: "#f7fafc",
  };

  const buttonStyle = {
    width: "100%",
    height: "50px",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "1.1rem",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    border: "none",
    color: "white",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
    fontFamily: "'Inter', sans-serif",
  };

  const socialButtonStyle = {
    width: "100%",
    height: "45px",
    borderRadius: "12px",
    fontWeight: "500",
    fontSize: "0.95rem",
    border: "2px solid #e2e8f0",
    background: "white",
    color: "#4a5568",
    transition: "all 0.3s ease",
    marginBottom: "0.75rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
  };

  return (
    <div style={signinContainerStyle}>
      <div style={backgroundPatternStyle}></div>

      <Container>
        <Card style={cardStyle}>
          <Card.Body style={cardBodyStyle}>
            <div style={logoStyle}>
              <FaPaw />
            </div>

            <h2 style={titleStyle}>Welcome Back!</h2>
            <p style={subtitleStyle}>Sign in to continue to Pet-Mart</p>

            {error && (
              <Alert
                variant="danger"
                dismissible
                onClose={() => setError("")}
                style={{
                  borderRadius: "12px",
                  fontSize: "0.9rem",
                  animation: "shake 0.5s",
                }}
              >
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit} noValidate>
              <div style={inputGroupStyle}>
                <FaEnvelope style={inputIconStyle} />
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  isInvalid={!!errors.email}
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#667eea";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(102, 126, 234, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <Form.Control.Feedback
                  type="invalid"
                  style={{ fontSize: "0.875rem" }}
                >
                  {errors.email}
                </Form.Control.Feedback>
              </div>

              <div style={inputGroupStyle}>
                <FaLock style={inputIconStyle} />
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                  isInvalid={!!errors.password}
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#667eea";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(102, 126, 234, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <Button
                  variant="link"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "0.5rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 3,
                    color: "#667eea",
                    textDecoration: "none",
                    padding: "0.5rem",
                  }}
                  tabIndex={-1}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
                <Form.Control.Feedback
                  type="invalid"
                  style={{ fontSize: "0.875rem" }}
                >
                  {errors.password}
                </Form.Control.Feedback>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                }}
              >
                {/* <Form.Check
                  type="checkbox"
                  id="rememberMe"
                  label="Remember me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ fontSize: "0.9rem", color: "#4a5568" }}
                /> */}
                {/* <Link
                  to="/forgot-password"
                  style={{
                    color: "#667eea",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#764ba2")}
                  onMouseLeave={(e) => (e.target.style.color = "#667eea")}
                >
                  Forgot password?
                </Link> */}
              </div>

              <Button
                type="submit"
                style={buttonStyle}
                disabled={loading}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow =
                      "0 6px 20px rgba(102, 126, 234, 0.5)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 4px 15px rgba(102, 126, 234, 0.4)";
                }}
              >
                {loading ? (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>

              <div style={{ position: "relative", margin: "2rem 0" }}>
                <hr style={{ borderColor: "#e2e8f0" }} />
                <span
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: "white",
                    padding: "0 1rem",
                    color: "#718096",
                    fontSize: "0.9rem",
                  }}
                >
                  OR
                </span>
              </div>

              {/* Social Login Buttons */}
              {/* <button
                type="button"
                style={socialButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#4285f4";
                  e.currentTarget.style.color = "#4285f4";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.color = "#4a5568";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                onClick={(e) => {
                  e.preventDefault();
                  toast.info("Google login coming soon!", {
                    position: "top-center",
                  });
                }}
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  style={{ width: "20px" }}
                />
                Continue with Google
              </button>

              <button
                type="button"
                style={socialButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#1877f2";
                  e.currentTarget.style.color = "#1877f2";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.color = "#4a5568";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                onClick={(e) => {
                  e.preventDefault();
                  toast.info("Facebook login coming soon!", {
                    position: "top-center",
                  });
                }}
              >
                <img
                  src="https://www.svgrepo.com/show/475647/facebook-color.svg"
                  alt="Facebook"
                  style={{ width: "20px" }}
                />
                Continue with Facebook
              </button> */}

              <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <p
                  style={{
                    color: "#718096",
                    fontSize: "0.95rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  Don't have an account?
                </p>
                <Link
                  to="/register"
                  style={{
                    color: "#667eea",
                    textDecoration: "none",
                    fontWeight: "600",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    display: "inline-block",
                    padding: "0.5rem 1.5rem",
                    borderRadius: "8px",
                    border: "2px solid #667eea",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#667eea";
                    e.target.style.color = "white";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.color = "#667eea";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  Create Account
                </Link>
              </div>
            </Form>
          </Card.Body>
        </Card>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: "2rem",
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: "0.9rem",
          }}
        >
          <p>
            By signing in, you agree to our{" "}
            <Link
              to="/terms"
              style={{ color: "white", textDecoration: "underline" }}
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              style={{ color: "white", textDecoration: "underline" }}
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </Container>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          @keyframes shake {
            0%, 100% {
              transform: translateX(0);
            }
            10%, 30%, 50%, 70%, 90% {
              transform: translateX(-5px);
            }
            20%, 40%, 60%, 80% {
              transform: translateX(5px);
            }
          }

          .form-control:focus {
            background-color: white !important;
          }

          .form-check-input:checked {
            background-color: #667eea;
            border-color: #667eea;
          }

          .form-check-input:focus {
            box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.25);
          }

          /* Loading spinner animation */
          .spinner-border-sm {
            width: 1rem;
            height: 1rem;
            border-width: 0.2em;
          }

          /* Mobile responsiveness */
          @media (max-width: 576px) {
            .card-body {
              padding: 2rem !important;
            }

            h2 {
              font-size: 1.75rem !important;
            }

            .social-button {
              font-size: 0.9rem !important;
            }
          }

          /* Floating animation for background pattern */
          @keyframes float {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
            100% {
              transform: translateY(0px);
            }
          }

          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
          }

          ::-webkit-scrollbar-track {
            background: #f1f1f1;
          }

          ::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 4px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
          }
        `}
      </style>
    </div>
  );
}

export default SignIn;
