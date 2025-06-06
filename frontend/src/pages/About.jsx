import React from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function About() {
  const teamMembers = [
    {
      name: "Fahad Khan",
      role: "UI/UX Designer",
      bio: "With over 5 years of experience in React and Node.js, Fahad led the technical architecture and backend development. He's passionate about creating scalable solutions and clean code.",
      skills: ["React", "Node.js", "MYSQL", "AWS", "Prototyping", "Design Systems", "Git and GitHub"],
      icon: "🎨",
      image: "./public/images/fahad.jpg"
    },
    {
      name: "Mohammad Saif",
      role: "Full Stack Developer",
      bio: "Saif is a passionate full-stack developer with hands-on experience in building responsive web applications using Spring Boot and React. He specializes in developing clean RESTful APIs, scalable backend systems with Java and MySQL, and dynamic user interfaces using React.js. With a strong understanding of both frontend and backend technologies, Saif enjoys creating seamless, user-focused applications backed by robust architecture.",
      skills: ["Java", "Spring Boot", "RESTful API Development", "MySQL or PostgreSQL", "React.js", "JavaScript (ES6+)", "HTML5 & CSS3", "Git and GitHub"],
      icon: "💻",
      image: "./public/images/saif.jpg"
    },
    {
      name: "Sumayya Khan",
      role: "Product Manager",
      bio: "Emily coordinated the entire project from concept to launch. Her strategic thinking and attention to detail kept the team focused on delivering real value to users.",
      skills: ["Strategy", "Analytics", "Agile", "User Stories"],
      icon: "⚡",
      image: "./public/images/sumayya.jpg"
    },
  ];

  const navigate = useNavigate();

  // Styles
  const styles = {
    container: {
      background: "linear-gradient(135deg, #e0e7ff 0%, #f0e6ff 100%)",
      minHeight: "100vh",
      paddingTop: "3rem",
      paddingBottom: "3rem",
    },
    headerIcon: {
      width: "80px",
      height: "80px",
      background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "2rem",
      boxShadow: "0 8px 25px rgba(99, 102, 241, 0.3)",
      margin: "0 auto 2rem",
    },
    title: {
      fontSize: "3rem",
      fontWeight: "700",
      background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      marginBottom: "1.5rem",
    },
    leadText: {
      color: "#4b5563",
      fontSize: "1.2rem",
      lineHeight: "1.8",
      maxWidth: "700px",
    },
    missionCard: {
      background: "white",
      borderRadius: "20px",
      border: "none",
      boxShadow: "0 10px 30px rgba(99, 102, 241, 0.1)",
      overflow: "hidden",
      padding: "3rem",
    },
    teamCard: {
      background: "white",
      borderRadius: "20px",
      border: "none",
      boxShadow: "0 8px 25px rgba(99, 102, 241, 0.08)",
      padding: "2rem",
      height: "100%",
      transition: "all 0.3s ease",
    },
    memberIcon: {
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      overflow: "hidden",
      marginRight: "1rem",
      boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
    },
    memberImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    memberName: {
      fontSize: "1.3rem",
      fontWeight: "700",
      color: "#1f2937",
      marginBottom: "0.25rem",
    },
    memberRole: {
      background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      fontWeight: "600",
      fontSize: "1rem",
    },
    skillBadge: {
      background: "rgba(99, 102, 241, 0.1)",
      color: "#6366f1",
      border: "1px solid rgba(99, 102, 241, 0.2)",
      padding: "0.5rem 1rem",
      borderRadius: "25px",
      fontWeight: "500",
      fontSize: "0.85rem",
    },
    valuesCard: {
      background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
      borderRadius: "25px",
      border: "none",
      boxShadow: "0 15px 35px rgba(99, 102, 241, 0.3)",
      padding: "3rem",
      color: "white",
    },
    valueIcon: {
      width: "70px",
      height: "70px",
      background: "rgba(255, 255, 255, 0.2)",
      backdropFilter: "blur(10px)",
      borderRadius: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "2rem",
      margin: "0 auto 1rem",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    },
    ctaButton: {
      background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
      border: "none",
      padding: "1rem 3rem",
      fontSize: "1.1rem",
      fontWeight: "600",
      borderRadius: "30px",
      boxShadow: "0 6px 20px rgba(99, 102, 241, 0.3)",
      transition: "all 0.3s ease",
    },
  };

  return (
    <div style={styles.container}>
      <Container>
        {/* Header Section */}
        <div className="text-center mb-5">
          <div style={styles.headerIcon}>🐾</div>
          <h1 style={styles.title}>About Pet-Mart</h1>
          <p style={styles.leadText} className="mx-auto">
            Pet-Mart was born from a shared vision to create the ultimate
            platform for pet lovers. Our diverse team combined their unique
            skills and perspectives to bring this idea to life.
          </p>
        </div>

        {/* Mission Section */}
        <Row className="justify-content-center mb-5">
          <Col lg={10}>
            <Card style={styles.missionCard}>
              <Card.Body>
                <h2
                  style={{
                    ...styles.title,
                    fontSize: "2.5rem",
                    textAlign: "center",
                    marginBottom: "2rem",
                  }}
                >
                  Our Mission
                </h2>
                <p
                  style={{
                    ...styles.leadText,
                    textAlign: "center",
                    maxWidth: "800px",
                    margin: "0 auto",
                  }}
                >
                  We believe in connecting pets with loving families and
                  providing everything pet owners need in one convenient place.
                  Our goal was to create an intuitive, comprehensive platform
                  that makes pet adoption and care accessible to everyone. Every
                  feature was designed with both pets and their humans in mind.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Team Section */}
        <div className="mb-5">
          <h2
            style={{
              ...styles.title,
              fontSize: "2.5rem",
              textAlign: "center",
              marginBottom: "3rem",
            }}
          >
            Meet the Team
          </h2>
          <Row className="g-4">
            {teamMembers.map((member, index) => (
              <Col key={index} lg={4} md={6}>
                <Card
                  style={styles.teamCard}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 30px rgba(99, 102, 241, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 25px rgba(99, 102, 241, 0.08)";
                  }}
                >
                  <Card.Body>
                    <div className="d-flex align-items-center mb-4">
                      <div style={styles.memberIcon}>
                        <img src={member.image} alt={member.name} style={styles.memberImage} />
                      </div>
                      <div>
                        <h3 style={styles.memberName}>{member.name}</h3>
                        <p style={styles.memberRole}>{member.role}</p>
                      </div>
                    </div>

                    <p
                      style={{
                        color: "#6b7280",
                        marginBottom: "1.5rem",
                        lineHeight: "1.8",
                      }}
                    >
                      {member.bio}
                    </p>

                    <div>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: "600",
                          color: "#4b5563",
                          marginBottom: "1rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Key Skills
                      </p>
                      <div className="d-flex flex-wrap gap-2">
                        {member.skills.map((skill, skillIndex) => (
                          <span key={skillIndex} style={styles.skillBadge}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Values Section */}
        <div className="mb-5">
          <Card style={styles.valuesCard}>
            <Card.Body>
              <h2
                style={{
                  textAlign: "center",
                  marginBottom: "3rem",
                  fontSize: "2.5rem",
                  fontWeight: "700",
                }}
              >
                Our Values
              </h2>
              <Row className="g-4">
                <Col md={4} className="text-center">
                  <div style={styles.valueIcon}>🐾</div>
                  <h5 style={{ fontWeight: "600", marginBottom: "1rem" }}>
                    Pet-Focused
                  </h5>
                  <p style={{ opacity: "0.9", lineHeight: "1.8" }}>
                    Every pet deserves a loving home. We prioritize their
                    well-being in everything we do.
                  </p>
                </Col>
                <Col md={4} className="text-center">
                  <div style={styles.valueIcon}>👥</div>
                  <h5 style={{ fontWeight: "600", marginBottom: "1rem" }}>
                    Community
                  </h5>
                  <p style={{ opacity: "0.9", lineHeight: "1.8" }}>
                    We're building a community of pet lovers who support each
                    other and their furry friends.
                  </p>
                </Col>
                <Col md={4} className="text-center">
                  <div style={styles.valueIcon}>💡</div>
                  <h5 style={{ fontWeight: "600", marginBottom: "1rem" }}>
                    Innovation
                  </h5>
                  <p style={{ opacity: "0.9", lineHeight: "1.8" }}>
                    We embrace new technologies and creative solutions to
                    improve pet adoption experiences.
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center" style={{ marginTop: "4rem" }}>
          <h2
            style={{
              ...styles.title,
              fontSize: "2rem",
              marginBottom: "1rem",
            }}
          >
            Questions About Pet-Mart?
          </h2>
          <p
            style={{
              color: "#6b7280",
              fontSize: "1.1rem",
              marginBottom: "2rem",
            }}
          >
            We're always excited to help pet lovers find their perfect
            companion.
          </p>
          <Button
            style={styles.ctaButton}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow =
                "0 8px 25px rgba(99, 102, 241, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow =
                "0 6px 20px rgba(99, 102, 241, 0.3)";
            }}
            onClick={() => navigate("/contact")}
          >
            Contact Us
          </Button>
        </div>

        {/* Stats Section */}
        <Row style={{ marginTop: "5rem", marginBottom: "3rem" }}>
          <Col md={3} xs={6} className="text-center mb-4">
            <div
              style={{
                fontSize: "3rem",
                fontWeight: "700",
                background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "0.5rem",
              }}
            >
              1000+
            </div>
            <p style={{ color: "#6b7280", fontWeight: "500" }}>Pets Adopted</p>
          </Col>
          <Col md={3} xs={6} className="text-center mb-4">
            <div
              style={{
                fontSize: "3rem",
                fontWeight: "700",
                background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "0.5rem",
              }}
            >
              500+
            </div>
            <p style={{ color: "#6b7280", fontWeight: "500" }}>
              Happy Families
            </p>
          </Col>
          <Col md={3} xs={6} className="text-center mb-4">
            <div
              style={{
                fontSize: "3rem",
                fontWeight: "700",
                background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "0.5rem",
              }}
            >
              50+
            </div>
            <p style={{ color: "#6b7280", fontWeight: "500" }}>
              Partner Shelters
            </p>
          </Col>
          <Col md={3} xs={6} className="text-center mb-4">
            <div
              style={{
                fontSize: "3rem",
                fontWeight: "700",
                background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "0.5rem",
              }}
            >
              24/7
            </div>
            <p style={{ color: "#6b7280", fontWeight: "500" }}>
              Support Available
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default About;
