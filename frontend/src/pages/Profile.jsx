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
          background: "linear-gradient(135deg, #f5f3ff 0%, #f0f9ff 100%)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Spinner
            animation="border"
            style={{
              color: "#6366f1",
              width: "3rem",
              height: "3rem",
              borderWidth: "0.3rem",
            }}
          />
          <p style={{ marginTop: "1rem", color: "#6b7280", fontWeight: "500" }}>
            Loading your profile...
          </p>
        </div>
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
          background: "linear-gradient(135deg, #f5f3ff 0%, #f0f9ff 100%)",
        }}
      >
        <Card
          style={{
            maxWidth: "450px",
            border: "none",
            borderRadius: "20px",
            boxShadow: "0 10px 40px rgba(99, 102, 241, 0.1)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              height: "8px",
            }}
          />
          <Card.Body className="text-center p-5">
            <div
              style={{
                fontSize: "4rem",
                marginBottom: "1rem",
                filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))",
              }}
            >
              {error ? "🔒" : "👤"}
            </div>
            <h3
              className="mb-3"
              style={{
                color: "#1e293b",
                fontWeight: "700",
              }}
            >
              {error ? "Access Denied" : "No Profile Data"}
            </h3>
            <p className="text-muted mb-4">
              {error || "Please sign in to view your profile."}
            </p>
            <Button
              onClick={() => navigate("/signin")}
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                border: "none",
                padding: "0.75rem 3rem",
                borderRadius: "50px",
                fontWeight: "600",
                boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
                transition: "all 0.3s ease",
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
        background: "linear-gradient(135deg, #f5f3ff 0%, #f0f9ff 100%)",
        minHeight: "calc(100vh - 116px)",
        padding: "2rem 0",
      }}
    >
      <Container fluid style={{ maxWidth: "1300px" }}>
        <Row className="g-4">
          {/* Left Column - User Info */}
          <Col lg={user && user.role === "ROLE_ADMIN" ? 12 : 4}>
            <Card
              style={{
                border: "none",
                borderRadius: "20px",
                boxShadow: "0 4px 20px rgba(99, 102, 241, 0.08)",
                background: "white",
                overflow: "hidden",
                height: "fit-content",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 8px 30px rgba(99, 102, 241, 0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(99, 102, 241, 0.08)";
              }}
            >
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  height: "100px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    bottom: "-40px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "90px",
                    height: "90px",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2.5rem",
                    color: "white",
                    fontWeight: "700",
                    boxShadow: "0 8px 24px rgba(99, 102, 241, 0.3)",
                    border: "4px solid white",
                  }}
                >
                  {user && user.firstName && user.lastName
                    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                    : "👤"}
                </div>
              </div>

              <Card.Body style={{ paddingTop: "60px" }}>
                <div className="text-center mb-4">
                  <h4
                    className="mb-1"
                    style={{
                      color: "#1e293b",
                      fontWeight: "700",
                      fontSize: "1.5rem",
                    }}
                  >
                    {user && `${user.firstName} ${user.lastName}`}
                  </h4>
                  <p
                    style={{
                      color: "#64748b",
                      fontSize: "0.95rem",
                    }}
                  >
                    {user && user.email}
                  </p>
                </div>

                <div
                  style={{
                    background:
                      "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                    borderRadius: "16px",
                    padding: "1.25rem",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div className="mb-3">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          background:
                            "linear-gradient(135deg, #ddd6fe 0%, #c7d2fe 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: "12px",
                          fontSize: "1.1rem",
                        }}
                      >
                        <i
                          className="bi bi-person-fill"
                          style={{
                            color: "#6366f1",
                          }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <span
                          style={{
                            color: "#94a3b8",
                            fontSize: "0.75rem",
                            fontWeight: "600",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          Full Name
                        </span>
                        <p
                          className="mb-0"
                          style={{
                            color: "#1e293b",
                            fontWeight: "600",
                            fontSize: "0.95rem",
                          }}
                        >
                          {user && `${user.firstName} ${user.lastName}`}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          background:
                            "linear-gradient(135deg, #ddd6fe 0%, #c7d2fe 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: "12px",
                          fontSize: "1.1rem",
                        }}
                      >
                        <i
                          className="bi bi-envelope-fill"
                          style={{
                            color: "#6366f1",
                          }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <span
                          style={{
                            color: "#94a3b8",
                            fontSize: "0.75rem",
                            fontWeight: "600",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          Email Address
                        </span>
                        <p
                          className="mb-0"
                          style={{
                            color: "#1e293b",
                            fontWeight: "600",
                            fontSize: "0.95rem",
                            wordBreak: "break-all",
                          }}
                        >
                          {user && user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="text-center mt-4 p-3"
                  style={{
                    background:
                      "linear-gradient(135deg, #ede9fe 0%, #dbeafe 100%)",
                    borderRadius: "12px",
                    border: "1px solid #c7d2fe",
                  }}
                >
                  <i
                    className="bi bi-shield-check"
                    style={{
                      color: "#6366f1",
                      fontSize: "1.25rem",
                      marginBottom: "0.5rem",
                      display: "block",
                    }}
                  />
                  <small
                    style={{
                      color: "#4c1d95",
                      fontWeight: "600",
                      fontSize: "0.875rem",
                    }}
                  >
                    {user && user.role === "ROLE_ADMIN"
                      ? "Pet-Mart Admin"
                      : "Pet-Mart Member"}
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Right Column - Reservations (only for non-admins) */}
          {user && user.role !== "ROLE_ADMIN" && (
            <Col lg={8}>
              <Card
                style={{
                  border: "none",
                  borderRadius: "20px",
                  boxShadow: "0 4px 20px rgba(99, 102, 241, 0.08)",
                  background: "white",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 8px 30px rgba(99, 102, 241, 0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 4px 20px rgba(99, 102, 241, 0.08)";
                }}
              >
                <Card.Header
                  style={{
                    background:
                      "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    color: "white",
                    fontWeight: "700",
                    fontSize: "1.1rem",
                    padding: "1.5rem",
                    border: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>
                    <i className="bi bi-calendar-check me-2"></i>
                    My Reservations
                  </span>
                  <Badge
                    pill
                    style={{
                      background: "rgba(255, 255, 255, 0.2)",
                      fontSize: "0.875rem",
                      padding: "0.5rem 1rem",
                    }}
                  >
                    {reservations.length} Total
                  </Badge>
                </Card.Header>

                <Card.Body
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    maxHeight: "calc(100vh - 350px)",
                    padding: "1.5rem",
                  }}
                >
                  {reservationLoading ? (
                    <div className="text-center py-5">
                      <Spinner
                        animation="border"
                        size="sm"
                        style={{ color: "#6366f1" }}
                      />
                      <p className="mt-2 text-muted">Loading reservations...</p>
                    </div>
                  ) : reservationError ? (
                    <div
                      className="text-center py-5"
                      style={{
                        background: "#fef2f2",
                        borderRadius: "12px",
                        border: "1px solid #fecaca",
                      }}
                    >
                      <i
                        className="bi bi-exclamation-circle"
                        style={{
                          fontSize: "2rem",
                          color: "#ef4444",
                        }}
                      />
                      <p className="mt-2 text-danger mb-0">
                        {reservationError}
                      </p>
                    </div>
                  ) : reservations.length > 0 ? (
                    <div className="row g-3">
                      {reservations.map((reservation, index) => (
                        <div key={index} className="col-12">
                          <div
                            style={{
                              background:
                                "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                              borderRadius: "16px",
                              padding: "1.25rem",
                              border: "1px solid #e2e8f0",
                              transition: "all 0.3s ease",
                              cursor: "pointer",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform =
                                "translateX(4px)";
                              e.currentTarget.style.borderColor = "#c7d2fe";
                              e.currentTarget.style.boxShadow =
                                "0 4px 12px rgba(99, 102, 241, 0.1)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateX(0)";
                              e.currentTarget.style.borderColor = "#e2e8f0";
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          >
                            <div className="d-flex justify-content-between align-items-start">
                              <div className="flex-grow-1">
                                <div className="d-flex align-items-center mb-2">
                                  <div
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                      borderRadius: "12px",
                                      background:
                                        "linear-gradient(135deg, #ddd6fe 0%, #c7d2fe 100%)",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      marginRight: "12px",
                                      fontSize: "1.5rem",
                                    }}
                                  >
                                    🐾
                                  </div>
                                  <div>
                                    <h6
                                      className="mb-0"
                                      style={{
                                        color: "#1e293b",
                                        fontWeight: "700",
                                        fontSize: "1rem",
                                      }}
                                    >
                                      {reservation.petName}
                                    </h6>
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
                                                style={{
                                                  color: "#64748b",
                                                  fontSize: "0.875rem",
                                                }}
                                              >
                                                {product.type} • {product.breed}
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
                                  </div>
                                </div>

                                <div className="d-flex flex-wrap gap-3 mt-2">
                                  {reservation.reservationDate && (
                                    <span
                                      style={{
                                        fontSize: "0.8rem",
                                        color: "#64748b",
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <i
                                        className="bi bi-calendar3 me-1"
                                        style={{ color: "#94a3b8" }}
                                      />
                                      Reserved:{" "}
                                      {new Date(
                                        reservation.reservationDate
                                      ).toLocaleDateString()}
                                    </span>
                                  )}
                                  {reservation.preferredVisitDate && (
                                    <span
                                      style={{
                                        fontSize: "0.8rem",
                                        color: "#64748b",
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <i
                                        className="bi bi-calendar-check me-1"
                                        style={{ color: "#94a3b8" }}
                                      />
                                      Visit:{" "}
                                      {new Date(
                                        reservation.preferredVisitDate
                                      ).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <Badge
                                pill
                                style={{
                                  padding: "0.5rem 1rem",
                                  fontSize: "0.8rem",
                                  fontWeight: "600",
                                  background:
                                    reservation.status === "ACCEPTED"
                                      ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                                      : reservation.status === "REJECTED"
                                      ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                                      : reservation.status === "PENDING"
                                      ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
                                      : "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
                                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                  border: "none",
                                }}
                              >
                                {reservation.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      className="text-center py-5"
                      style={{
                        background:
                          "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                        borderRadius: "16px",
                        border: "1px dashed #cbd5e1",
                      }}
                    >
                      <div
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 1rem",
                          fontSize: "2.5rem",
                        }}
                      >
                        📋
                      </div>
                      <h5 style={{ color: "#475569", fontWeight: "600" }}>
                        No Reservations Yet
                      </h5>
                      <p className="text-muted mb-0">
                        Your reservation requests will appear here
                      </p>
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
