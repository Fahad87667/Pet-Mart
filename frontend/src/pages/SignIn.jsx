import React, { useState } from "react";
import { Container, Card, Form, Button, Alert, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./style.css";

function SignIn({ updateAuthState }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        toast.success("Signed in successfully!", { autoClose: 1000 });
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

  return (
    <div className="signin-container">
      <Container>
        <Card className="signin-card">
          <div className="signin-logo">🐾</div>
          <h2 className="signin-title">Welcome Back!</h2>

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label className="signin-label">Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                isInvalid={!!errors.email}
                className="signin-input"
                required
              />
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4" controlId="formPassword">
              <Form.Label className="signin-label">Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                  isInvalid={!!errors.password}
                  className="signin-input"
                  required
                  minLength={6}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
              </InputGroup>

              <div className="text-end mt-2">
                <a className="signin-link" href="/forgot-password" onClick={(e) => e.preventDefault()}>
                  Forgot password?
                </a>
              </div>
            </Form.Group>

            <Button type="submit" className="signin-button" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center mt-4">
              <p className="signin-signup-text">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="signin-link"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/register");
                  }}
                >
                  Sign up
                </a>
              </p>
            </div>
          </Form>
        </Card>
      </Container>
    </div>
  );
}

export default SignIn;
