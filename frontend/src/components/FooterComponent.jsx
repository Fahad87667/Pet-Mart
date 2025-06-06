import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
        color: "white",
        paddingTop: "3rem",
        paddingBottom: "1.5rem",
        marginTop: "5rem",
      }}
    >
      <Container>
        <Row className="g-4">
          {/* Company Info */}
          <Col lg={4} md={6}>
            <div className="mb-4">
              <div className="d-flex align-items-center mb-3">
                <span style={{ fontSize: "28px", marginRight: "10px" }}>
                  🐾
                </span>
                <h4 className="mb-0">Pet-Mart</h4>
              </div>
              <p style={{ opacity: 0.85, fontSize: "14px" }}>
                Your trusted companion for finding the perfect pet. We connect
                loving families with their future furry friends.
              </p>
              <div className="d-flex gap-3 mt-3">
                <a
                  href="www.linkedin.com/in/mohammadsaif25"
                  className="text-white"
                  style={{ fontSize: "20px", opacity: 0.8 }}
                >
                  <i className="bi bi-linkedin"></i>
                </a>
                <a
                  href="https://www.instagram.com/precocious_warrior"
                  className="text-white"
                  style={{ fontSize: "20px", opacity: 0.8 }}
                >
                  <i className="bi bi-instagram"></i>
                </a>
                <a
                  href="https://x.com/MeanderingNinja"
                  className="text-white"
                  style={{ fontSize: "20px", opacity: 0.8 }}
                >
                  <i className="bi bi-twitter"></i>
                </a>
              </div>
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={2} md={6}>
            <div className="mb-4">
              <h6 className="mb-3">Quick Links</h6>
              <ul className="list-unstyled" style={{ fontSize: "14px" }}>
                <li className="mb-2">
                  <Link
                    to="/"
                    className="text-white text-decoration-none"
                    style={{ opacity: 0.85 }}
                  >
                    Home
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/find-pet"
                    className="text-white text-decoration-none"
                    style={{ opacity: 0.85 }}
                  >
                    Find a Pet
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/about"
                    className="text-white text-decoration-none"
                    style={{ opacity: 0.85 }}
                  >
                    About Us
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/cart"
                    className="text-white text-decoration-none"
                    style={{ opacity: 0.85 }}
                  >
                    My Cart
                  </Link>
                </li>
              </ul>
            </div>
          </Col>

          {/* Services */}
          <Col lg={3} md={6}>
            <div className="mb-4">
              <h6 className="mb-3">Our Services</h6>
              <ul className="list-unstyled" style={{ fontSize: "14px" }}>
                <li className="mb-2" style={{ opacity: 0.85 }}>
                  Pet Adoption
                </li>
                <li className="mb-2" style={{ opacity: 0.85 }}>
                  Pet Care Guides
                </li>
                <li className="mb-2" style={{ opacity: 0.85 }}>
                  24/7 Support
                </li>
                <li className="mb-2" style={{ opacity: 0.85 }}>
                  Health Guarantee
                </li>
              </ul>
            </div>
          </Col>

          {/* Contact Info */}
          <Col lg={3} md={6}>
            <div className="mb-4">
              <h6 className="mb-3">Get in Touch</h6>
              <ul className="list-unstyled" style={{ fontSize: "14px" }}>
                <li className="mb-2" style={{ opacity: 0.85 }}>
                  <i className="bi bi-geo-alt me-2"></i>
                  123 Pet Street, City, State 12345
                </li>
                <li className="mb-2" style={{ opacity: 0.85 }}>
                  <i className="bi bi-telephone me-2"></i>
                  1-800-PET-MART
                </li>
                <li className="mb-2" style={{ opacity: 0.85 }}>
                  <i className="bi bi-envelope me-2"></i>
                  support@pet-mart.com
                </li>
                <li style={{ opacity: 0.85 }}>
                  <i className="bi bi-clock me-2"></i>
                  Mon-Fri: 9AM-6PM
                </li>
                <li className="mt-3">
                  <Link
                    to="/contact"
                    className="btn btn-light"
                    style={{
                      background: "white",
                      color: "#6366f1",
                      border: "none",
                      padding: "8px 20px",
                      borderRadius: "8px",
                      fontWeight: "600",
                      transition: "all 0.3s ease",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 4px 10px rgba(0,0,0,0.15)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
                    }}
                  >
                    <i className="bi bi-chat-dots"></i>
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </Col>
        </Row>

        <hr
          style={{
            borderColor: "rgba(255, 255, 255, 0.2)",
            marginTop: "2rem",
            marginBottom: "1.5rem",
          }}
        />

        {/* Bottom Bar */}
        <Row>
          <Col md={6}>
            <p className="mb-0" style={{ fontSize: "14px", opacity: 0.7 }}>
              © {currentYear} Pet-Mart. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <p className="mb-0" style={{ fontSize: "14px", opacity: 0.7 }}>
              Made with ❤️ for pet lovers
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
