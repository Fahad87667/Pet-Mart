import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Spinner,
} from "react-bootstrap";
import { getCurrentUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import * as reservationService from "../services/reservationService";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [reservationLoading, setReservationLoading] = useState(true);
  const [reservationError, setReservationError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        } else {
          setError("User not logged in.");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!user) return;

      try {
        setReservationLoading(true);
        const userReservations = await reservationService.getUserReservations();
        setReservations(userReservations || []);
      } catch (err) {
        console.error("Error fetching reservations:", err);
        setReservationError("Failed to load reservations.");
      } finally {
        setReservationLoading(false);
      }
    };

    fetchReservations();
  }, [user]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 116px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8f9fa",
        }}
      >
        <Spinner animation="border" style={{ color: "#6366f1" }} />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 116px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8f9fa",
        }}
      >
        <Card
          style={{
            maxWidth: "400px",
            border: "none",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <Card.Body className="text-center p-5">
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
              {error ? "🔒" : "👤"}
            </div>
            <h4 className="mb-3">
              {error ? "Access Denied" : "No Profile Data"}
            </h4>
            <p className="text-muted mb-4">
              {error || "Please sign in to view your profile."}
            </p>
            <Button
              onClick={() => navigate("/signin")}
              style={{
                background: "#6366f1",
                border: "none",
                padding: "0.5rem 2rem",
              }}
            >
              Sign In
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#f8f9fa",
        minHeight: "calc(100vh - 116px)",
        padding: "2rem 0",
      }}
    >
      <Container fluid style={{ maxWidth: "1400px" }}>
        {/* Compact Header */}
        <div className="text-center mb-4">
          <h2 style={{ color: "#1f2937", fontWeight: "700" }}>My Profile</h2>
        </div>

        <Row className="g-4">
          {/* Left Column - User Info */}
          <Col
            lg={user && user.role === "ROLE_ADMIN" ? 8 : 4}
            className={
              user && user.role === "ROLE_ADMIN" ? "mx-auto" : "" // Center the card if it takes full width
            }
          >
            <Card
              style={{
                border: "none",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                height: "fit-content",
              }}
            >
              <Card.Body>
                <div className="text-center mb-4">
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      background: "#6366f1",
                      margin: "0 auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2rem",
                      color: "white",
                    }}
                  >
                    {user.firstName && user.lastName
                      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                      : "👤"}
                  </div>
                  <h4 className="mt-3 mb-1">
                    {user.firstName} {user.lastName}
                  </h4>
                  <p className="text-muted">{user.email}</p>
                </div>

                <div
                  style={{
                    background: "#f3f4f6",
                    borderRadius: "8px",
                    padding: "1rem",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted small">FULL NAME</span>
                    <span className="fw-semibold">
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">EMAIL</span>
                    <span className="fw-semibold small">{user.email}</span>
                  </div>
                </div>

                <div className="text-center mt-3">
                  <small className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Member since {new Date().getFullYear()}
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Right Column - Reservations */}
          {user && user.role !== "ROLE_ADMIN" && (
            <Col lg={8}>
              <Card
                style={{
                  border: "none",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <Card.Header
                  style={{
                    background: "#6366f1",
                    color: "white",
                    fontWeight: "600",
                  }}
                >
                  <i className="bi bi-calendar-check me-2"></i>
                  My Reservations ({reservations.length})
                </Card.Header>
                <Card.Body
                  style={{
                    maxHeight: "calc(100vh - 300px)",
                    overflowY: "auto",
                  }}
                >
                  {reservationLoading ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" size="sm" /> Loading...
                    </div>
                  ) : reservationError ? (
                    <div className="text-center text-danger py-5">
                      {reservationError}
                    </div>
                  ) : reservations.length > 0 ? (
                    <div className="row g-3">
                      {reservations.map((reservation, index) => (
                        <div key={index} className="col-12">
                          <div
                            style={{
                              background: "#f8f9fa",
                              borderRadius: "8px",
                              padding: "1rem",
                              border: "1px solid #e5e7eb",
                            }}
                          >
                            <div className="d-flex justify-content-between align-items-start">
                              <div className="flex-grow-1">
                                <h6 className="mb-1">
                                  {reservation.petName}
                                  {reservation.reservedItemsDetails &&
                                    (() => {
                                      try {
                                        const details = JSON.parse(
                                          reservation.reservedItemsDetails
                                        );
                                        if (
                                          details &&
                                          details.length > 0 &&
                                          details[0].product
                                        ) {
                                          const product = details[0].product;
                                          return (
                                            <span
                                              className="text-muted ms-2"
                                              style={{ fontSize: "0.875rem" }}
                                            >
                                              ({product.type} - {product.breed})
                                            </span>
                                          );
                                        }
                                      } catch (e) {
                                        console.error(
                                          "Failed to parse reservedItemsDetails",
                                          e
                                        );
                                      }
                                      return null;
                                    })()}
                                </h6>
                                <div className="d-flex gap-3 text-muted small">
                                  {reservation.reservationDate && (
                                    <span>
                                      <i className="bi bi-calendar me-1"></i>
                                      Reserved:{" "}
                                      {new Date(
                                        reservation.reservationDate
                                      ).toLocaleDateString()}
                                    </span>
                                  )}
                                  {reservation.preferredVisitDate && (
                                    <span>
                                      <i className="bi bi-calendar-check me-1"></i>
                                      Visit:{" "}
                                      {new Date(
                                        reservation.preferredVisitDate
                                      ).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <Badge
                                bg={
                                  reservation.status === "ACCEPTED"
                                    ? "success"
                                    : reservation.status === "REJECTED"
                                    ? "danger"
                                    : reservation.status === "PENDING"
                                    ? "info"
                                    : "secondary"
                                }
                              >
                                {reservation.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5 text-muted">
                      <i
                        className="bi bi-calendar-x"
                        style={{ fontSize: "3rem" }}
                      ></i>
                      <p className="mt-2">No reservation requests found.</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
}

export default Profile;
