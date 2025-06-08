import React, { useEffect, useState, useRef } from "react";
import { Container, Card, Spinner, Alert, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ReservationStatus() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState(location.state?.status);
  const [reservationDetails, setReservationDetails] = useState(
    location.state?.reservationDetails
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toastShown = useRef(false);

  useEffect(() => {
    if (!status) {
      navigate("/");
      return;
    }
    // Dismiss any previous reservation status toast
    toast.dismiss("reservation-status-toast");
    let message = "";
    if (status === "PENDING") {
      message = "Your reservation is being reviewed. We'll contact you soon!";
    } else if (status === "ACCEPTED") {
      message = "Your reservation has been accepted!";
    } else if (status === "REJECTED") {
      message = "Your reservation has been rejected.";
    }
    if (message) {
      toast.info(message, {
        toastId: "reservation-status-toast",
        position: "top-center",
        autoClose: 5000,
      });
    }
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [status, navigate]);

  const renderStatusMessage = () => {
    if (loading) {
      return (
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <p>Loading reservation status...</p>
        </div>
      );
    }
    if (error) {
      return <Alert variant="danger">Error: {error}</Alert>;
    }
    switch (status) {
      case "PENDING":
        return (
          <Alert variant="info">
            <h4 className="alert-heading">Reservation Under Review</h4>
            <p>We are currently reviewing your adoption request. You can check the status in your profile section.</p>
          </Alert>
        );
      case "ACCEPTED":
        return (
          <Alert variant="success">
            <h4 className="alert-heading">Reservation Accepted!</h4>
            <p>Your adoption request has been approved. Please visit us on your scheduled date.</p>
          </Alert>
        );
      case "REJECTED":
        return (
          <Alert variant="danger">
            <h4 className="alert-heading">Reservation Rejected</h4>
            <p>We apologize, but your adoption request has been rejected. Please contact us for more information.</p>
          </Alert>
        );
      default:
        return <Alert variant="warning">Unknown reservation status.</Alert>;
    }
  };

  const renderReservationDetails = () => {
    if (!reservationDetails) return null;

    try {
      const details = JSON.parse(reservationDetails.reservedItemsDetails);
      if (!details || !details.length) return null;

      const product = details[0].product;
      return (
        <div className="mt-4">
          <h5 style={{ color: "#1e293b", fontWeight: "600" }}>Reservation Details</h5>
          <div
            style={{
              background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
              borderRadius: "16px",
              padding: "1.25rem",
              border: "1px solid #e2e8f0",
            }}
          >
            <div className="d-flex align-items-center gap-3">
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                }}
              >
                🐾
              </div>
              <div>
                <h6 style={{ color: "#1e293b", fontWeight: "600", marginBottom: "0.25rem" }}>
                  {product.name}
                </h6>
                <p style={{ color: "#64748b", fontSize: "0.875rem", marginBottom: "0" }}>
                  {product.type} • {product.breed}
                </p>
              </div>
            </div>
            <div className="mt-3 d-flex flex-wrap gap-3">
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <i className="bi bi-calendar3" style={{ color: "#94a3b8" }} />
                Reserved: {new Date(reservationDetails.reservationDate).toLocaleDateString()}
              </div>
              {reservationDetails.preferredVisitDate && (
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "#64748b",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <i className="bi bi-calendar-check" style={{ color: "#94a3b8" }} />
                  Visit: {new Date(reservationDetails.preferredVisitDate).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    } catch (e) {
      console.error("Error parsing reservation details:", e);
      return null;
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #e0e7ff 0%, #f0e6ff 100%)",
        minHeight: "calc(100vh - 116px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 0",
      }}
    >
      <Container style={{ maxWidth: "600px" }}>
        <Card
          style={{
            background: "white",
            borderRadius: "20px",
            border: "none",
            boxShadow: "0 10px 30px rgba(99, 102, 241, 0.1)",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <Card.Body>
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
                fontSize: "2.5rem",
              }}
            >
              {status === "PENDING" ? "⏳" : status === "ACCEPTED" ? "✅" : "❌"}
            </div>
            <h2 style={{ color: "#6366f1", marginBottom: "1.5rem" }}>
              Reservation Status
            </h2>
            {renderStatusMessage()}
            {renderReservationDetails()}
            <div className="mt-4">
              <Button
                variant="primary"
                onClick={() => navigate("/profile")}
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  border: "none",
                  padding: "0.75rem 2rem",
                  fontWeight: "600",
                  borderRadius: "25px",
                  boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
                }}
              >
                <i className="bi bi-person-circle me-2" />
                View in Profile
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default ReservationStatus;
