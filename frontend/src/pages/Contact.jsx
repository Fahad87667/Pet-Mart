import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaPaw, FaPaperPlane, FaMapMarkedAlt, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import axios from 'axios';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    
    const [validated, setValidated] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [messageError, setMessageError] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Phone validation
        if (name === 'phone') {
            const phoneRegex = /^[89]\d{9}$/;
            if (!phoneRegex.test(value)) {
                setPhoneError('Please enter a valid 10-digit number starting with 9 or 8.');
            } else {
                setPhoneError('');
            }
        }
        
        // Message validation
        if (name === 'message') {
            if (value.length < 20) {
                setMessageError('Message must be at least 20 characters long.');
            } else if (value.length > 500) {
                setMessageError('Message must not exceed 500 characters.');
            } else {
                setMessageError('');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        
        if (form.checkValidity() === false || phoneError || messageError) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await axios.post('http://localhost:8080/api/contact', formData);
            
            if (response.status === 200) {
                setShowAlert(true);
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: ''
                });
                setValidated(false);
                console.log("Form submitted:", formData);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setShowAlert(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#f8f9fa', paddingTop: '60px' }}>
            <Container className="py-5">
                {/* Header Section */}
                <div className="contact-header text-center" style={{
                    backgroundColor: '#fff',
                    padding: '2rem',
                    borderRadius: '10px',
                    boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.1)',
                    marginBottom: '2rem'
                }}>
                    <h1 className="display-5 fw-bold" style={{
                        background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text"
                    }}>Contact Pet Mart</h1>
                    <p className="lead" style={{ color: "#6b7280" }}>Have questions about our pet products or services? We're here to help!</p>
                </div>

                {/* Success/Error Messages */}
                {successMessage && (
                    <Alert variant="success" dismissible onClose={() => setSuccessMessage('')}>
                        {successMessage}
                    </Alert>
                )}
                
                {errorMessage && (
                    <Alert variant="danger" dismissible onClose={() => setErrorMessage('')}>
                        {errorMessage}
                    </Alert>
                )}

                <Row className="g-4">
                    {/* Contact Information Column */}
                    <Col lg={5}>
                        <Card className="h-100 contact-card" style={{
                            border: 'none',
                            borderRadius: '10px',
                            boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.1)',
                            marginBottom: '2rem',
                            background: 'linear-gradient(135deg, #f0f4ff 0%, #f5f0ff 100%)'
                        }}>
                            <Card.Body>
                                <h2 className="card-title mb-4" style={{
                                    color: "#6366f1",
                                    fontWeight: "600"
                                }}>
                                    <FaPaw className="me-2" />Get in Touch
                                </h2>
                                
                                <div className="info-item" style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    marginBottom: '1.5rem'
                                }}>
                                    <div className="info-icon" style={{
                                        width: '40px',
                                        height: '40px',
                                        background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                                        color: 'white',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: '15px',
                                        flexShrink: '0'
                                    }}>
                                        <FaMapMarkerAlt />
                                    </div>
                                    <div>
                                        <h5 className="fw-bold" style={{ 
                                            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                            backgroundClip: "text"
                                        }}>Our Location</h5>
                                        <p className="mb-0" style={{ color: "#a855f7" }}>123 Pet Street, Animal City, AC 12345</p>
                                    </div>
                                </div>
                                
                                <div className="info-item" style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    marginBottom: '1.5rem'
                                }}>
                                    <div className="info-icon" style={{
                                        width: '40px',
                                        height: '40px',
                                        background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                                        color: 'white',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: '15px',
                                        flexShrink: '0'
                                    }}>
                                        <FaPhone />
                                    </div>
                                    <div>
                                        <h5 className="fw-bold" style={{ 
                                            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                            backgroundClip: "text"
                                        }}>Phone Number</h5>
                                        <p className="mb-1" style={{ color: "#a855f7" }}>(123) 456-7890</p>
                                        <p className="mb-0" style={{ color: "#a855f7" }}>(987) 654-3210 (Emergency)</p>
                                    </div>
                                </div>
                                
                                <div className="info-item" style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    marginBottom: '1.5rem'
                                }}>
                                    <div className="info-icon" style={{
                                        width: '40px',
                                        height: '40px',
                                        background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                                        color: 'white',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: '15px',
                                        flexShrink: '0'
                                    }}>
                                        <FaEnvelope />
                                    </div>
                                    <div>
                                        <h5 className="fw-bold" style={{ 
                                            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                            backgroundClip: "text"
                                        }}>Email Address</h5>
                                        <p className="mb-1" style={{ color: "#a855f7" }}>info@petmart.com</p>
                                        <p className="mb-0" style={{ color: "#a855f7" }}>support@petmart.com</p>
                                    </div>
                                </div>
                                
                                <div className="info-item" style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    marginBottom: '1.5rem'
                                }}>
                                    <div className="info-icon" style={{
                                        width: '40px',
                                        height: '40px',
                                        background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                                        color: 'white',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: '15px',
                                        flexShrink: '0'
                                    }}>
                                        <FaClock />
                                    </div>
                                    <div>
                                        <h5 className="fw-bold" style={{ 
                                            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                            backgroundClip: "text"
                                        }}>Business Hours</h5>
                                        <p className="mb-1" style={{ color: "#a855f7" }}>Monday - Friday: 9:00 AM - 6:00 PM</p>
                                        <p className="mb-1" style={{ color: "#a855f7" }}>Saturday: 10:00 AM - 4:00 PM</p>
                                        <p className="mb-0" style={{ color: "#a855f7" }}>Sunday: Closed</p>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Contact Form Column */}
                    <Col lg={7}>
                        <Card className="contact-card" style={{
                            border: 'none',
                            borderRadius: '10px',
                            boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.1)',
                            marginBottom: '2rem'
                        }}>
                            <Card.Body>
                                <h2 className="card-title mb-4" style={{
                                    color: "#6366f1",
                                    fontWeight: "600"
                                }}>
                                    <FaPaperPlane className="me-2" />Send us a Message
                                </h2>
                                
                                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                    <Row className="mb-3">
                                        <Col md={6} className="mb-3 mb-md-0">
                                            <Form.Group controlId="name">
                                                <Form.Label>Your Name *</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    minLength={2}
                                                    maxLength={50}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter your name (2-50 characters).
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="email">
                                                <Form.Label>Email Address *</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter a valid email address.
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    
                                    <Form.Group className="mb-3" controlId="phone">
                                        <Form.Label>Phone Number *</Form.Label>
                                        <Form.Control
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            isInvalid={!!phoneError}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {phoneError || 'Please enter a valid 10-digit number starting with 9 or 8.'}
                                        </Form.Control.Feedback>
                                        <Form.Text>Must be 10 digits starting with 9 or 8</Form.Text>
                                    </Form.Group>
                                    
                                    <Form.Group className="mb-3" controlId="subject">
                                        <Form.Label>Subject *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            minLength={5}
                                            maxLength={100}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Subject must be 5-100 characters.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    
                                    <Form.Group className="mb-4" controlId="message">
                                        <Form.Label>Your Message *</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={5}
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            isInvalid={!!messageError}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {messageError || 'Message must be between 20-500 characters.'}
                                        </Form.Control.Feedback>
                                        <Form.Text>Message must be between 20-500 characters</Form.Text>
                                    </Form.Group>
                                    
                                    <div className="text-center">
                                        <Button 
                                            type="submit"
                                            className="btn-submit"
                                            style={{
                                                background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                                                border: "none",
                                                padding: '0.5rem 2rem'
                                            }}
                                            disabled={isSubmitting}
                                        >
                                            <FaPaperPlane className="me-2" />Send Message
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Map Section */}
                <Row className="mt-5">
                    <Col>
                        <Card className="contact-card" style={{
                            border: 'none',
                            borderRadius: '10px',
                            boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.1)',
                            marginBottom: '2rem'
                        }}>
                            <Card.Body>
                                <h2 className="card-title mb-4" style={{
                                    background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                    fontWeight: "600"
                                }}>
                                    <FaMapMarkedAlt className="me-2" />Our Location
                                </h2>
                                <div className="map-container" style={{
                                    borderRadius: '10px',
                                    overflow: 'hidden',
                                    boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.1)'
                                }}>
                                    <iframe 
                                        title="Pet Mart Location"
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.8597825275283!2d73.05167127469294!3d19.025899382168355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c24cce39457b%3A0x8bd69eab297890b0!2sCentre%20for%20Development%20of%20Advanced%20Computing%20(CDAC)!5e0!3m2!1sen!2sin!4v1749019666175!5m2!1sen!2sin" 
                                        width="100%" 
                                        height="400" 
                                        style={{ border: '0' }} 
                                        allowFullScreen="" 
                                        loading="lazy"
                                        className="rounded"
                                    />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ContactPage;