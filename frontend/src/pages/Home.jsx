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

  const heroImages = [
    "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2069&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514984879728-be0aff75a6e8?q=80&w=2084&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=2070&auto=format&fit=crop",
  ];

  const visions = [
    {
      icon: "🏠",
      title: "Safe Homes",
      description: "We ensure every pet finds a loving and secure forever home",
    },
    {
      icon: "💝",
      title: "Ethical Breeding",
      description:
        "Supporting responsible breeders who prioritize pet health and happiness",
    },
    {
      icon: "🌟",
      title: "Lifetime Support",
      description:
        "Providing guidance and support throughout your pet's journey",
    },
    {
      icon: "🤝",
      title: "Community Building",
      description:
        "Creating a network of pet lovers who share knowledge and experiences",
    },
  ];

  const feedback = [
    {
      text: "Amazing service and happy pets! Highly recommend.",
      author: "Mrunali Jangam",
      rating: 5,
      image: "/images/devi.jpg",
    },
    {
      text: "Found my perfect companion thanks to Pet-Mart.",
      author: "Mohammad Saif",
      rating: 5,
      image: "/images/saif.jpg",
    },
    {
      text: "Excellent variety and great customer support.",
      author: "Mohammad Anas",
      rating: 5,
      image: "/images/anas.jpg",
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

  const stats = [
    { number: "5000+", label: "Happy Pets Adopted" },
    { number: "4500+", label: "Satisfied Families" },
    { number: "100+", label: "Certified Breeders" },
    { number: "24/7", label: "Customer Support" },
  ];

  const chunkedPets = [];
  for (let i = 0; i < featuredPets.length; i += 3) {
    chunkedPets.push(featuredPets.slice(i, i + 3));
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Hero Section with Background Carousel */}
      <div
        style={{ position: "relative", height: "100vh", overflow: "hidden" }}
      >
        <Carousel
          fade
          controls={false}
          indicators={false}
          interval={6000}
          pause={false}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: 0,
          }}
        >
          {heroImages.map((image, index) => (
            <Carousel.Item key={index} style={{ height: "100vh" }}>
              <div
                style={{
                  backgroundImage: `url(${image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "100%",
                  width: "100%",
                  filter: "brightness(0.7)",
                }}
              />
            </Carousel.Item>
          ))}
        </Carousel>

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(135deg, rgba(99, 102, 241, 0.5) 0%, rgba(168, 85, 247, 0.5) 100%)",
            zIndex: 1,
          }}
        />

        <Container
          style={{
            position: "relative",
            zIndex: 2,
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Row className="align-items-center w-100">
            <Col md={7} className="text-center text-md-start">
              <h1
                style={{
                  fontSize: "4rem",
                  fontWeight: "800",
                  color: "white",
                  marginBottom: "1.5rem",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                Find Your Forever Friend
              </h1>
              <p
                style={{
                  fontSize: "1.5rem",
                  color: "rgba(255, 255, 255, 0.95)",
                  marginBottom: "2.5rem",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                }}
              >
                Welcome to Pet-Mart, where loving homes find their perfect
                companions.
              </p>
              <Button
                variant="light"
                size="lg"
                onClick={() => navigate("/find-pet")}
                style={{
                  borderRadius: "30px",
                  padding: "1rem 3rem",
                  fontWeight: "700",
                  fontSize: "1.2rem",
                  boxShadow: "0 8px 30px rgba(255, 255, 255, 0.3)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-3px) scale(1.05)";
                  e.target.style.boxShadow =
                    "0 12px 40px rgba(255, 255, 255, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0) scale(1)";
                  e.target.style.boxShadow =
                    "0 8px 30px rgba(255, 255, 255, 0.3)";
                }}
              >
                Browse Pets
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Our Vision Section */}
      <section style={{ background: "#f9fafb", padding: "5rem 0" }}>
        <Container>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2
              style={{
                fontSize: "3rem",
                fontWeight: "700",
                background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "1rem",
              }}
            >
              Our Vision
            </h2>
            <p
              style={{
                fontSize: "1.3rem",
                color: "#6b7280",
                maxWidth: "700px",
                margin: "0 auto",
              }}
            >
              We believe every pet deserves a loving home and every home
              deserves the joy of a pet
            </p>
          </div>

          <Row className="g-4">
            {visions.map((vision, index) => (
              <Col key={index} md={6} lg={3}>
                <div
                  style={{
                    background: "white",
                    borderRadius: "25px",
                    padding: "2.5rem",
                    height: "100%",
                    textAlign: "center",
                    boxShadow: "0 10px 30px rgba(99, 102, 241, 0.1)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 40px rgba(99, 102, 241, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(99, 102, 241, 0.1)";
                  }}
                >
                  <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>
                    {vision.icon}
                  </div>
                  <h4
                    style={{
                      fontWeight: "700",
                      color: "#1f2937",
                      marginBottom: "1rem",
                    }}
                  >
                    {vision.title}
                  </h4>
                  <p style={{ color: "#6b7280", fontSize: "1rem", margin: 0 }}>
                    {vision.description}
                  </p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
          padding: "3rem 0",
        }}
      >
        <Container>
          <Row className="g-4">
            {stats.map((stat, index) => (
              <Col key={index} xs={6} md={3} className="text-center">
                <h3
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "800",
                    color: "white",
                    marginBottom: "0.5rem",
                  }}
                >
                  {stat.number}
                </h3>
                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontSize: "1.1rem",
                    margin: 0,
                  }}
                >
                  {stat.label}
                </p>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Featured Pets Section */}
      <section style={{ padding: "5rem 0", background: "white" }}>
        <Container>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "3rem",
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
            <p style={{ fontSize: "1.3rem", color: "#6b7280" }}>
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
                          borderRadius: "25px",
                          overflow: "hidden",
                          boxShadow: "0 10px 30px rgba(99, 102, 241, 0.15)",
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                          height: "100%",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform =
                            "translateY(-10px) scale(1.02)";
                          e.currentTarget.style.boxShadow =
                            "0 20px 40px rgba(99, 102, 241, 0.25)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform =
                            "translateY(0) scale(1)";
                          e.currentTarget.style.boxShadow =
                            "0 10px 30px rgba(99, 102, 241, 0.15)";
                        }}
                        onClick={() => navigate("/find-pet")}
                      >
                        <div
                          style={{
                            position: "relative",
                            overflow: "hidden",
                            height: "280px",
                          }}
                        >
                          <Image
                            src={pet.image}
                            alt={pet.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform 0.3s ease",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              top: "15px",
                              right: "15px",
                              background: "rgba(255, 255, 255, 0.95)",
                              borderRadius: "25px",
                              padding: "8px 20px",
                              fontWeight: "700",
                              color: "#6366f1",
                              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            {pet.price}
                          </div>
                        </div>
                        <Card.Body style={{ padding: "1.5rem" }}>
                          <h5
                            style={{
                              fontWeight: "700",
                              color: "#1f2937",
                              marginBottom: "0.5rem",
                              fontSize: "1.3rem",
                            }}
                          >
                            {pet.name}
                          </h5>
                          <p
                            style={{
                              color: "#6b7280",
                              margin: 0,
                              fontSize: "1rem",
                            }}
                          >
                            Age: {pet.age}
                          </p>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Carousel.Item>
            ))}
          </Carousel>

          <div className="text-center mt-5">
            <Button
              variant="primary"
              onClick={() => navigate("/find-pet")}
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                border: "none",
                borderRadius: "30px",
                padding: "1rem 3rem",
                fontWeight: "700",
                fontSize: "1.1rem",
                boxShadow: "0 8px 30px rgba(99, 102, 241, 0.3)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow =
                  "0 12px 40px rgba(99, 102, 241, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 8px 30px rgba(99, 102, 241, 0.3)";
              }}
            >
              View All Pets
            </Button>
          </div>
        </Container>
      </section>

      {/* Customer Feedback Section */}
      <section style={{ background: "#f9fafb", padding: "5rem 0" }}>
        <Container>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2
              style={{
                fontSize: "3rem",
                fontWeight: "700",
                background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "1rem",
              }}
            >
              Customer Stories
            </h2>
            <p style={{ fontSize: "1.3rem", color: "#6b7280" }}>
              See what our happy customers have to say
            </p>
          </div>
          <Row className="g-4">
            {feedback.map((item, index) => (
              <Col key={index} lg={4} md={6}>
                <div
                  style={{
                    background: "white",
                    borderRadius: "25px",
                    padding: "2.5rem",
                    height: "100%",
                    boxShadow: "0 10px 30px rgba(99, 102, 241, 0.1)",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 40px rgba(99, 102, 241, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(99, 102, 241, 0.1)";
                  }}
                >
                  <div style={{ display: "flex", marginBottom: "1.5rem" }}>
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
                      marginBottom: "2rem",
                      flex: 1,
                      fontStyle: "italic",
                    }}
                  >
                    "{item.text}"
                  </p>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        marginRight: "1rem",
                        boxShadow: "0 4px 15px rgba(99, 102, 241, 0.2)",
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
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${item.author}&background=6366f1&color=fff`;
                        }}
                      />
                    </div>
                    <span style={{ fontWeight: "600", color: "#1f2937" }}>
                      {item.author}
                    </span>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Call to Action Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
          padding: "5rem 0",
          textAlign: "center",
        }}
      >
        <Container>
          <h2
            style={{
              fontSize: "3rem",
              fontWeight: "700",
              color: "white",
              marginBottom: "1.5rem",
            }}
          >
            Ready to Find Your Perfect Pet?
          </h2>
          <p
            style={{
              fontSize: "1.3rem",
              color: "rgba(255, 255, 255, 0.9)",
              marginBottom: "2.5rem",
              maxWidth: "600px",
              margin: "0 auto 2.5rem",
            }}
          >
            Join thousands of happy families who found their furry friends
            through Pet-Mart
          </p>
          <Button
            variant="light"
            size="lg"
            onClick={() => navigate("/find-pet")}
            style={{
              borderRadius: "30px",
              padding: "1rem 3rem",
              fontWeight: "700",
              fontSize: "1.2rem",
              boxShadow: "0 8px 30px rgba(255, 255, 255, 0.3)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-3px) scale(1.05)";
              e.target.style.boxShadow = "0 12px 40px rgba(255, 255, 255, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0) scale(1)";
              e.target.style.boxShadow = "0 8px 30px rgba(255, 255, 255, 0.3)";
            }}
          >
            Start Your Journey
          </Button>
        </Container>
      </section>

      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
          }

          .carousel-control-prev-icon,
          .carousel-control-next-icon {
            background-color: rgba(99, 102, 241, 0.8);
            border-radius: 50%;
            padding: 20px;
          }

          .carousel-indicators button {
            background-color: rgba(99, 102, 241, 0.5);
            width: 12px;
            height: 12px;
            border-radius: 50%;
          }

          .carousel-indicators button.active {
            background-color: #6366f1;
            width: 35px;
            border-radius: 20px;
          }

          .carousel-control-prev,
          .carousel-control-next {
            width: 5%;
          }

          .carousel-item {
            transition: transform 0.8s ease-in-out;
          }

          @media (max-width: 768px) {
            h1 { font-size: 2.5rem !important; }
            h2 { font-size: 2rem !important; }
            .carousel-item .col-md-4 { margin-bottom: 1rem; }
          }
        `}
      </style>
    </div>
  );
}

export default Home;
