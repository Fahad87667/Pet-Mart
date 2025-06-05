import React, { useEffect, useState } from "react";
import { Container, Card, Spinner, Alert } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

function ReservationStatus() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState(location.state?.status);
  const [reservationDetails, setReservationDetails] = useState(
    location.state?.reservationDetails
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In a real application, you would likely fetch the reservation status
    // from the backend using the reservation ID received after submission.
    // For this example, we're using the status passed in the state.

    if (!status) {
      // If status is not passed, redirect to home or a relevant page
      navigate("/");
      return;
    }

    // Simulate loading for a moment
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
            We are currently reviewing your adoption request.
          </Alert>
        );
      case "ACCEPTED":
        return (
          <Alert variant="success">
            Your order has been placed successfully!
          </Alert>
        );
      case "REJECTED":
        return (
          <Alert variant="danger">
            Your adoption request has been rejected.
          </Alert>
        );
      default:
        return <Alert variant="warning">Unknown reservation status.</Alert>;
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #e0e7ff 0%, #f0e6ff 100%)",
        minHeight: "calc(100vh - 116px)", // Adjust height based on header/footer
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
            <h2 style={{ color: "#6366f1", marginBottom: "1.5rem" }}>
              Reservation Status
            </h2>
            {renderStatusMessage()}
            {/* You could display reservation details here if needed */}
            {/* <pre>{JSON.stringify(reservationDetails, null, 2)}</pre> */}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default ReservationStatus;
