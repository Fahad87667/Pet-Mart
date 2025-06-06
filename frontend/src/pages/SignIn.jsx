import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { toast } from "react-toastify";
import "./style.css";

function SignIn({ updateAuthState }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(formData.email, formData.password);
      if (user) {
        updateAuthState(user);
        toast.success("Signed in successfully!", {
          autoClose: 1000,
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

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="signin-label">Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="signin-input"
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="signin-label">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="signin-input"
                required
              />
              <div className="text-end mt-2">
                <a className="signin-link">Forgot password?</a>
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
