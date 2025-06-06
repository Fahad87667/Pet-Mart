import React from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Image,
  Carousel,
  Card,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const feedback = [
    {
      text: "Amazing service and happy pets! Highly recommend.",
      author: "Mrunali Jangam",
      rating: 5,
      image: "./public/images/devi.jpg"
    },
    {
      text: "Found my perfect companion thanks to Pet-Mart.",
      author: "Mohammad Saif",
      rating: 5,
      image: "./public/images/saif.jpg"
    },
    {
      text: "Excellent variety and great customer support.",
      author: "Mohammad Anas",
      rating: 5,
      image: "./public/images/anas.jpg"
    },
  ];

  const featuredPets = [
    {
      image:
        "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=2069&auto=format&fit=crop",
      name: "Golden Retriever",
      age: "3 months",
      price: "₹1200",
    },
    {
      image:
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2043&auto=format&fit=crop",
      name: "British Shorthair",
      age: "4 months",
      price: "₹1600",
    },
    {
      image:
        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=2070&auto=format&fit=crop",
      name: "German Shepherd",
      age: "2 months",
      price: "₹1900",
    },
    {
      image:
        "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=1974&auto=format&fit=crop",
      name: "French Bulldog",
      age: "5 months",
      price: "₹2200",
    },
    {
      image:
        "https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=2015&auto=format&fit=crop",
      name: "Maine Coon",
      age: "3 months",
      price: "₹1700",
    },
    {
      image:
        "https://images.unsplash.com/photo-1558788353-f76d92427f16?q=80&w=2070&auto=format&fit=crop",
      name: "Beagle Puppy",
      age: "2 months",
      price: "₹1550",
    },
  ];

  // Group pets into chunks of 3 for carousel
  const chunkedPets = [];
  for (let i = 0; i < featuredPets.length; i += 3) {
    chunkedPets.push(featuredPets.slice(i, i + 3));
  }

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #e0e7ff 0%, #f0e6ff 100%)",
        minHeight: "100vh",
        paddingTop: "4rem",
        paddingBottom: "4rem",
      }}
    >
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start mb-4 mb-md-0">
            <h1
              style={{
                fontSize: "3.5rem",
                fontWeight: "700",
                background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "1.5rem",
              }}
            >
              Find Your Forever Friend
            </h1>
            <p
              style={{
                fontSize: "1.3rem",
                color: "#4b5563",
                marginBottom: "2rem",
              }}
            >
              Welcome to Pet-Mart, where loving homes find their perfect
              companions. Browse our selection of adorable pets ready for
              adoption.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate("/find-pet")}
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                border: "none",
                borderRadius: "25px",
                padding: "0.75rem 2.5rem",
                fontWeight: "600",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow = "0 6px 20px rgba(99, 102, 241, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(99, 102, 241, 0.3)";
              }}
            >
              Browse Pets
            </Button>
          </Col>
          <Col md={6} className="text-center">
            <Image
              src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              fluid
              style={{
                maxWidth: "100%",
                height: "auto",
                animation: "float 3s ease-in-out infinite",
              }}
            />
          </Col>
        </Row>
      </Container>

      {/* Featured Pets Section - Enhanced */}
      <section
        style={{
          marginTop: "4rem",
          padding: "4rem 0",
          background: "white",
          borderRadius: "30px",
          boxShadow: "0 10px 30px rgba(99, 102, 241, 0.1)",
        }}
      >
        <Container>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: "700",
                background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "1rem",
              }}
            >
              Featured Pets
            </h2>
            <p style={{ fontSize: "1.2rem", color: "#6b7280" }}>
              Meet some of our adorable pets looking for their forever homes
            </p>
          </div>

          <Carousel
            indicators={true}
            controls={true}
            interval={5000}
            pause="hover"
          >
            {chunkedPets.map((chunk, index) => (
              <Carousel.Item key={index}>
                <Row className="g-4 px-3">
                  {chunk.map((pet, petIndex) => (
                    <Col md={4} key={petIndex}>
                      <Card
                        style={{
                          border: "none",
                          borderRadius: "20px",
                          overflow: "hidden",
                          boxShadow: "0 8px 25px rgba(99, 102, 241, 0.1)",
                          transition: "transform 0.3s ease",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-10px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                        onClick={() => navigate("/find-pet")}
                      >
                        <div
                          style={{
                            position: "relative",
                            overflow: "hidden",
                            height: "250px",
                          }}
                        >
                          <Image
                            src={pet.image}
                            alt={pet.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              top: "10px",
                              right: "10px",
                              background: "rgba(255, 255, 255, 0.9)",
                              borderRadius: "20px",
                              padding: "5px 15px",
                              fontWeight: "600",
                              color: "#6366f1",
                            }}
                          >
                            {pet.price}
                          </div>
                        </div>
                        <Card.Body>
                          <h5
                            style={{
                              fontWeight: "600",
                              color: "#1f2937",
                              marginBottom: "0.5rem",
                            }}
                          >
                            {pet.name}
                          </h5>
                          <p
                            style={{
                              color: "#6b7280",
                              margin: 0,
                              fontSize: "14px",
                            }}
                          >
                            Age: {pet.age}
                          </p>
                          {/* <Button
                            variant="outline-primary"
                            size="sm"
                            className="mt-3 w-100"
                            style={{
                              borderRadius: "15px",
                              borderColor: "#6366f1",
                              color: "#6366f1",
                            }}
                          >
                            View Details
                          </Button> */}
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Carousel.Item>
            ))}
          </Carousel>

          <div className="text-center mt-4">
            <Button
              variant="primary"
              onClick={() => navigate("/find-pet")}
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                border: "none",
                borderRadius: "25px",
                padding: "0.75rem 2rem",
                fontWeight: "600",
              }}
            >
              View All Pets
            </Button>
          </div>
        </Container>
      </section>

      {/* Customer Feedback Section */}
      <section
        style={{
          marginTop: "4rem",
          padding: "4rem 0",
          background: "white",
          borderRadius: "30px",
          boxShadow: "0 10px 30px rgba(99, 102, 241, 0.1)",
        }}
      >
        <Container>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: "700",
                background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "1rem",
              }}
            >
              Customer Feedback
            </h2>
            <p style={{ fontSize: "1.2rem", color: "#6b7280" }}>
              See what our happy customers have to say
            </p>
          </div>
          <Row className="g-4">
            {feedback.map((item, index) => (
              <Col key={index} lg={4} md={6}>
                <div
                  style={{
                    background: "white",
                    borderRadius: "20px",
                    padding: "2rem",
                    height: "100%",
                    boxShadow: "0 8px 25px rgba(99, 102, 241, 0.08)",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      marginBottom: "1rem",
                    }}
                  >
                    {[...Array(item.rating)].map((_, i) => (
                      <span
                        key={i}
                        style={{
                          color: "#f59e0b",
                          fontSize: "1.5rem",
                          marginRight: "0.25rem",
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p
                    style={{
                      fontSize: "1.1rem",
                      color: "#4b5563",
                      marginBottom: "1.5rem",
                      flex: 1,
                    }}
                  >
                    "{item.text}"
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "auto",
                    }}
                  >
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        marginRight: "1.5rem",
                        boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.author}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontWeight: "600",
                        color: "#1f2937",
                      }}
                    >
                      {item.author}
                    </span>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <style>
        {`
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

          .carousel-control-prev-icon,
          .carousel-control-next-icon {
            background-color: rgba(99, 102, 241, 0.8);
            border-radius: 50%;
            padding: 20px;
          }

          .carousel-indicators button {
            background-color: rgba(99, 102, 241, 0.5);
          }

          .carousel-indicators button.active {
            background-color: #6366f1;
          }

          .carousel-control-prev,
          .carousel-control-next {
            width: 5%;
          }

          .carousel-item {
            transition: transform 0.8s ease-in-out;
          }
        `}
      </style>
    </div>
  );
}

export default Home;
