import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Table,
  Modal,
  Badge,
  Alert,
  Tabs,
  Tab,
  Spinner,
} from "react-bootstrap";
import { adminService } from "../services/adminService";
import { toast } from "react-toastify";
import { productService } from "../services/productService";
import api from "../services/api";

function Admin({ isAdmin, isLoggedIn }) {
  const [pets, setPets] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [resLoading, setResLoading] = useState(false);
  const [resError, setResError] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "DOG",
    breed: "",
    age: "",
    gender: "Male",
    description: "",
    price: "",
    image: "",
    status: "available",
    fileData: null,
  });

  const stats = {
    totalPets: pets.length,
    available: pets.filter((p) => p.status === "available").length,
    adopted: pets.filter((p) => p.status === "adopted").length,
    pending: pets.filter((p) => p.status === "pending").length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "ACCEPTED":
        return "success";
      case "REJECTED":
        return "danger";
      default:
        return "secondary";
    }
  };

  const handleReservationStatus = async (id, status) => {
    setResLoading(true);
    try {
      await api.put(`/admin/reservations/${id}/status`, { status });
      if (status === "ACCEPTED") {
        toast.success("Reservation accepted!.", {
          autoClose: 2000,
        });
      } else if (status === "REJECTED") {
        toast.info("Reservation rejected.", {
          autoClose: 2000,
        });
      } else {
        toast.success(`Reservation ${status.toLowerCase()} successfully!`, {
          autoClose: 1000,
        });
      }
      fetchReservations();
      fetchPets();
    } catch (err) {
      toast.error(
        `Failed to update status: ${
          err.response?.data?.message || err.message
        }`,
        {
          autoClose: 1000,
        }
      );
    } finally {
      setResLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("type", formData.type);
    data.append("breed", formData.breed);
    data.append("age", formData.age);
    data.append("gender", formData.gender);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("status", formData.status);

    if (formData.fileData) {
      data.append("fileData", formData.fileData);
    }

    try {
      if (showEditModal && selectedPet) {
        data.append("code", selectedPet.code);
        await adminService.updateProduct(selectedPet.code, data);
        toast.success("Pet updated successfully!", {
          autoClose: 1000,
        });
      } else {
        await adminService.addProduct(data);
        toast.success("Pet added successfully!", {
          autoClose: 1000,
        });
      }
      fetchPets();
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Failed: ${error.message || "Unknown error"}`, {
        autoClose: 1000,
      });
    }
    handleCloseModal();
  };

  const fetchPets = async () => {
    setLoading(true);
    try {
      const response = await productService.getProducts(0, 1000);
      setPets(response.items || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching pets:", err);
      setError(err.message || "Failed to fetch pets.");
    } finally {
      setLoading(false);
    }
  };

  const fetchReservations = async () => {
    setResLoading(true);
    try {
      const response = await api.get("/admin/reservations");
      console.log("Fetched reservations:", response.data);
      // Sort reservations: PENDING first, then by date (newest first)
      const sortedReservations = response.data.sort((a, b) => {
        // First sort by status (PENDING first)
        if (a.status === "PENDING" && b.status !== "PENDING") return -1;
        if (a.status !== "PENDING" && b.status === "PENDING") return 1;

        // Then sort by date (newest first)
        return new Date(b.reservationDate) - new Date(a.reservationDate);
      });

      setReservations(sortedReservations || []);
      setResError(null);
    } catch (err) {
      console.error("Error fetching reservations:", err);
      setResError(err.message || "Failed to fetch reservations");
      toast.error("Failed to fetch reservations. Please try again later.");
    } finally {
      setResLoading(false);
    }
  };

  const fetchContacts = async () => {
    setContactLoading(true);
    try {
      const response = await api.get("/admin/contacts");
      setContacts(response.data || []);
      setContactError(null);
    } catch (err) {
      console.error("Error fetching contacts:", err);
      setContactError(err.message || "Failed to fetch contact submissions");
      toast.error(
        "Failed to fetch contact submissions. Please try again later."
      );
    } finally {
      setContactLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && isAdmin) {
      fetchPets();
      fetchReservations();
      fetchContacts();
    }

    // Add event listener for refreshing admin dashboard
    const handleRefresh = () => {
      fetchReservations();
      fetchContacts();
    };
    window.addEventListener("refreshAdminDashboard", handleRefresh);

    // Cleanup event listener
    return () => {
      window.removeEventListener("refreshAdminDashboard", handleRefresh);
    };
  }, [isLoggedIn, isAdmin]);

  const handleDelete = async (petCode) => {
    if (window.confirm("Are you sure you want to delete this pet?")) {
      try {
        await adminService.deleteProduct(petCode);
        toast.error("Pet deleted successfully!", {
          autoClose: 1000,
        });
        fetchPets();
      } catch (error) {
        console.error("Error deleting pet:", error);
        toast.error(
          `Failed to delete pet: ${error.message || "Unknown error"}`,
          {
            autoClose: 1000,
          }
        );
      }
    }
  };

  const handleEdit = (pet) => {
    setSelectedPet(pet);
    setFormData({
      name: pet.name ?? "",
      type: pet.type ?? "DOG",
      breed: pet.breed ?? "",
      age: pet.age ?? "",
      gender: pet.gender ?? "Male",
      description: pet.description ?? "",
      price: pet.price ?? 0,
      image: pet.imagePath ?? "",
      status: pet.status ? pet.status.toLowerCase() : "available",
      fileData: null,
    });
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedPet(null);
    setFormData({
      name: "",
      type: "DOG",
      breed: "",
      age: "",
      gender: "Male",
      description: "",
      price: "",
      image: "",
      status: "available",
      fileData: null,
    });
  };

  const getTypeBadgeColor = (type) => {
    const colors = { DOG: "#3b82f6", CAT: "#f59e0b", BIRD: "#10b981" };
    return colors[type] || "#6366f1";
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      available: "#28a745",
      adopted: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
      pending: "#ffc107",
    };
    return colors[status] || "#007bff";
  };

  if (!isLoggedIn || !isAdmin) {
    return (
      <Container className="mt-5 text-center">
        <Alert variant="danger">
          You do not have permission to view this page.
        </Alert>
      </Container>
    );
  }

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #e0e7ff 0%, #f0e6ff 100%)",
        minHeight: "100vh",
        paddingTop: "2rem",
        paddingBottom: "3rem",
      }}
    >
      <Container>
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "2rem",
          }}
        >
          Admin Dashboard
        </h1>

        {alert && (
          <Alert
            variant={alert.type}
            dismissible
            onClose={() => setAlert(null)}
            style={{ borderRadius: "15px", marginBottom: "2rem" }}
          >
            {alert.message}
          </Alert>
        )}

        <Row className="mb-4">
          {[
            { icon: "🐾", value: stats.totalPets, label: "Total Pets" },
            { icon: "✅", value: stats.available, label: "Available" },
            { icon: "🏠", value: stats.adopted, label: "Adopted" },
            {
              icon: "📋",
              value: reservations.filter((r) => r.status === "PENDING").length,
              label: "Pending Reservations",
            },
          ].map((stat, idx) => (
            <Col md={3} sm={6} className="mb-3" key={idx}>
              <Card
                style={{
                  background: "white",
                  borderRadius: "20px",
                  padding: "1.5rem",
                  border: "none",
                  boxShadow: "0 8px 25px rgba(99, 102, 241, 0.08)",
                }}
              >
                <Card.Body className="text-center">
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                    {stat.icon}
                  </div>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "700",
                      background:
                        "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {stat.value}
                  </div>
                  <p style={{ color: "#6b7280", marginBottom: "0" }}>
                    {stat.label}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Card
          style={{
            background: "white",
            borderRadius: "20px",
            border: "none",
            boxShadow: "0 10px 30px rgba(99, 102, 241, 0.1)",
            padding: "2rem",
          }}
        >
          <Card.Body>
            <Tabs
              id="admin-tabs"
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-3"
            >
              <Tab eventKey="overview" title="Pet Management">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 style={{ fontWeight: "600", marginBottom: "0" }}>
                    All Pets
                  </h4>
                  <Button
                    onClick={() => setShowAddModal(true)}
                    style={{
                      background:
                        "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                      border: "none",
                      borderRadius: "25px",
                      padding: "0.5rem 1.5rem",
                      fontWeight: "600",
                    }}
                  >
                    + Add New Pet
                  </Button>
                </div>

                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Breed</th>
                        <th>Age</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pets.map((pet) => (
                        <tr key={pet.id}>
                          <td>
                            <img
                              src={
                                pet.imagePath
                                  ? `http://localhost:8080${pet.imagePath}`
                                  : "https://via.placeholder.com/50?text=No+Image"
                              }
                              alt={pet.name}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                          </td>
                          <td>{pet.name}</td>
                          <td>
                            <Badge
                              pill
                              bg=""
                              style={{
                                background: getTypeBadgeColor(pet.type),
                                color: "white",
                              }}
                            >
                              {pet.type}
                            </Badge>
                          </td>
                          <td>{pet.breed}</td>
                          <td>{pet.age}</td>
                          <td>₹{pet.price?.toFixed(2) || "0.00"}</td>
                          <td>
                            <Badge
                              pill
                              bg=""
                              style={{
                                background: getStatusBadgeColor(
                                  (pet.status || "").toLowerCase()
                                ),
                                color: "white",
                                fontWeight: 700,
                                fontSize: "0.95rem",
                                letterSpacing: 1,
                              }}
                            >
                              {(pet.status || "").toUpperCase()}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleEdit(pet)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(pet.code)}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Tab>

              <Tab eventKey="reservations" title="Reservations">
                <h4 style={{ fontWeight: "600", marginBottom: "1rem" }}>
                  Pet Reservations
                </h4>

                {resError && (
                  <Alert variant="danger" className="mb-3">
                    {resError}
                  </Alert>
                )}

                <div className="table-responsive">
                  {reservations.length > 0 ? (
                    <div
                      style={{
                        maxHeight: "600px",
                        overflowY: "auto",
                        border: "1px solid #e9ecef",
                        borderRadius: "8px",
                      }}
                    >
                      <Table hover className="reservation-table">
                        <thead
                          style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          <tr>
                            <th>Reservation Details</th>
                            <th>Customer Information</th>
                            <th>Pet Details</th>
                            <th>Visit Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reservations.map((reservation) => (
                            <tr key={`reservation-${reservation.id}`}>
                              <td>
                                <div className="reservation-info">
                                  <div className="reservation-header">
                                    <span className="reservation-id">
                                      #{reservation.id}
                                    </span>
                                    <span className="reservation-date">
                                      {new Date(
                                        reservation.reservationDate
                                      ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </div>
                                  {reservation.message && (
                                    <div className="message-box">
                                      <div className="message-header">
                                        <i className="bi bi-chat-left-text"></i>
                                        <strong>Customer Message</strong>
                                      </div>
                                      <p>{reservation.message}</p>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td>
                                <div className="customer-info">
                                  <div className="customer-header">
                                    <i className="bi bi-person-circle"></i>
                                    <strong>{reservation.customerName}</strong>
                                  </div>
                                  <div className="customer-details">
                                    <div className="detail-item">
                                      <i className="bi bi-envelope"></i>
                                      <span>{reservation.customerEmail}</span>
                                    </div>
                                    <div className="detail-item">
                                      <i className="bi bi-telephone"></i>
                                      <span>{reservation.customerPhone}</span>
                                    </div>
                                    {reservation.customerAddress &&
                                      reservation.customerAddress !== "N/A" && (
                                        <div className="detail-item">
                                          <i className="bi bi-geo-alt"></i>
                                          <span>
                                            {reservation.customerAddress}
                                          </span>
                                        </div>
                                      )}
                                  </div>
                                </div>
                              </td>
                              <td>
                                {reservation.reservedItemsDetails &&
                                  JSON.parse(
                                    reservation.reservedItemsDetails
                                  ).map((item, idx) => (
                                    <div
                                      key={`item-${reservation.id}-${idx}`}
                                      className="pet-item"
                                    >
                                      <div className="pet-image">
                                        <img
                                          src={
                                            item.productInfo.imagePath
                                              ? `http://localhost:8080${item.productInfo.imagePath}`
                                              : "https://via.placeholder.com/40"
                                          }
                                          alt={item.productInfo.name}
                                        />
                                      </div>
                                      <div className="pet-details">
                                        <div className="pet-name">
                                          <span>{item.productInfo.name}</span>
                                          <Badge
                                            bg={getTypeBadgeColor(
                                              item.productInfo.type
                                            )}
                                          >
                                            {item.productInfo.type}
                                          </Badge>
                                        </div>
                                        <div className="pet-info">
                                          <span className="breed">
                                            {item.productInfo.breed}
                                          </span>
                                          <span className="age">
                                            {item.productInfo.age}
                                          </span>
                                        </div>
                                        <div className="pet-price">
                                          <span className="amount">
                                            ₹{item.amount.toFixed(2)}
                                          </span>
                                          <span className="quantity">
                                            Qty: {item.quantity}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </td>
                              <td>
                                <div className="visit-date">
                                  <i className="bi bi-calendar-check"></i>
                                  <span>
                                    {new Date(
                                      reservation.preferredVisitDate
                                    ).toLocaleDateString("en-US", {
                                      weekday: "short",
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <Badge
                                  bg={getStatusColor(reservation.status)}
                                  className="status-badge"
                                >
                                  {reservation.status.toLowerCase()}
                                </Badge>
                              </td>
                              <td>
                                <div className="action-buttons">
                                  {reservation.status === "PENDING" && (
                                    <>
                                      <Button
                                        variant="success"
                                        size="sm"
                                        onClick={() =>
                                          handleReservationStatus(
                                            reservation.id,
                                            "ACCEPTED"
                                          )
                                        }
                                        disabled={resLoading}
                                        className="action-button"
                                      >
                                        <i className="bi bi-check-circle"></i>
                                        Accept
                                      </Button>
                                      <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() =>
                                          handleReservationStatus(
                                            reservation.id,
                                            "REJECTED"
                                          )
                                        }
                                        disabled={resLoading}
                                        className="action-button"
                                      >
                                        <i className="bi bi-x-circle"></i>
                                        Reject
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  ) : resLoading ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" />
                      <p>Loading reservations...</p>
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <div className="empty-state-icon">📋</div>
                      <h5>No Reservations Found</h5>
                      <p>
                        When customers make reservations, they will appear here.
                      </p>
                    </div>
                  )}
                </div>
              </Tab>

              <Tab eventKey="contacts" title="Contact Submissions">
                <Card className="mt-4">
                  <Card.Body>
                    <h3
                      className="mb-4"
                      style={{
                        color: "#6366f1",
                        fontWeight: "600",
                      }}
                    >
                      Contact Form Submissions
                    </h3>

                    {contactLoading ? (
                      <div className="text-center py-4">
                        <Spinner animation="border" variant="primary" />
                      </div>
                    ) : contactError ? (
                      <Alert variant="danger">{contactError}</Alert>
                    ) : contacts.length === 0 ? (
                      <Alert variant="info">No contact submissions yet.</Alert>
                    ) : (
                      <div className="table-responsive">
                        <Table hover className="align-middle">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Phone</th>
                              <th>Subject</th>
                              <th>Message</th>
                            </tr>
                          </thead>
                          <tbody>
                            {contacts.map((contact) => (
                              <tr key={contact.id}>
                                <td>
                                  {new Date(
                                    contact.createdAt
                                  ).toLocaleDateString()}
                                </td>
                                <td>{contact.name}</td>
                                <td>{contact.email}</td>
                                <td>{contact.phone}</td>
                                <td>{contact.subject}</td>
                                <td>
                                  <div
                                    style={{
                                      maxWidth: "200px",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {contact.message}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>

        <Modal
          show={showAddModal || showEditModal}
          onHide={handleCloseModal}
          size="lg"
        >
          <Modal.Header
            closeButton
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              color: "white",
              borderRadius: "20px 20px 0 0",
              border: "none",
            }}
          >
            <Modal.Title>
              {showEditModal ? "Edit Pet" : "Add New Pet"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: "2rem" }}>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Pet Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Type</Form.Label>
                    <Form.Select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      required
                    >
                      <option value="DOG">Dog</option>
                      <option value="CAT">Cat</option>
                      <option value="BIRD">Bird</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Breed</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.breed}
                      onChange={(e) =>
                        setFormData({ ...formData, breed: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Age</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.age}
                      onChange={(e) =>
                        setFormData({ ...formData, age: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      required
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Unknown">Unknown</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Adoption Price (₹)</Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) =>
                    setFormData({ ...formData, fileData: e.target.files[0] })
                  }
                />
                {formData.image && !formData.fileData && (
                  <div className="mt-2">
                    Current Image:
                    <img
                      src={`http://localhost:8080${formData.image}`}
                      alt="Current pet image"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        marginLeft: "10px",
                        borderRadius: "5px",
                      }}
                    />
                  </div>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  required
                >
                  <option value="available">Available</option>
                  <option value="adopted">Adopted</option>
                  <option value="pending">Pending</option>
                </Form.Select>
              </Form.Group>

              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  style={{
                    background:
                      "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                    border: "none",
                  }}
                >
                  {showEditModal ? "Update Pet" : "Add Pet"}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
}

export default Admin;

const styles = `
  .reservation-table {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }

  .reservation-table th {
    background: #f8f9fa;
    border-bottom: 2px solid #e9ecef;
    padding: 12px;
    font-weight: 600;
    white-space: nowrap;
  }

  .reservation-table td {
    padding: 16px;
    vertical-align: top;
  }

  .reservation-table tbody tr:hover {
    background-color: #f8f9fa;
  }

  .reservation-table::-webkit-scrollbar {
    width: 8px;
  }

  .reservation-table::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  .reservation-table::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  .reservation-table::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  .reservation-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .reservation-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .reservation-id {
    font-weight: 600;
    color: #6366f1;
  }

  .reservation-date {
    font-size: 0.875rem;
    color: #6c757d;
  }

  .message-box {
    background: #f8f9fa;
    border-left: 3px solid #6366f1;
    padding: 12px;
    border-radius: 4px;
  }

  .message-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 6px;
    color: #495057;
  }

  .message-box p {
    margin: 0;
    color: #6c757d;
    font-size: 0.875rem;
  }

  .customer-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .customer-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
  }

  .customer-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .detail-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.875rem;
    color: #6c757d;
  }

  .pet-item {
    display: flex;
    gap: 12px;
    padding: 8px;
    background: #f8f9fa;
    border-radius: 6px;
    margin-bottom: 8px;
  }

  .pet-image img {
    width: 48px;
    height: 48px;
    object-fit: cover;
    border-radius: 6px;
  }

  .pet-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .pet-name {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
  }

  .pet-info {
    display: flex;
    gap: 8px;
    font-size: 0.875rem;
    color: #6c757d;
  }

  .pet-price {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
  }

  .amount {
    color: #28a745;
    font-weight: 500;
  }

  .quantity {
    color: #6c757d;
  }

  .visit-date {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #495057;
  }

  .status-badge {
    padding: 6px 12px;
    font-weight: 500;
    text-transform: capitalize;
  }

  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .action-button {
    display: flex;
    align-items: center;
    gap: 6px;
    justify-content: center;
  }

  .empty-state-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  .bi {
    font-size: 1rem;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
