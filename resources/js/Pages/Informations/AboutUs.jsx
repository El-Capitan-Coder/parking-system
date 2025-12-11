import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import '../../../css/Informations/aboutus.css';
import aboutImage from '../../../../Images/logo-1.png'; // Replace with a relevant parking image

const AboutUs = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <div className="hero-section text-white text-center py-5">
        <Container>
          <h1 className="display-4 fw-bold">About the UCC Parking System</h1>
          <p className="lead mt-3">
            A secure and efficient parking solution exclusively for professors, deans, and officials of Urdaneta City University.
          </p>
        </Container>
      </div>

      {/* Mission Section */}
      <Container className="my-5">
        <Row className="align-items-center mb-5">
          <Col md={6}>
            <img 
              src={aboutImage} 
              className="img-fluid rounded shadow" 
              alt="UCC Parking System"
            />
          </Col>
          <Col md={6}>
            <h3 className="text-accent mb-3">Our Mission</h3>
            <p>
              Our mission is to provide a <strong>dedicated and well-organized parking system</strong> 
              for the professors, deans, and officials of Urdaneta City University. 
              By ensuring proper allocation of spaces and maintaining security, 
              we aim to support the academic leaders of UCC with a convenient and reliable parking experience.
            </p>
          </Col>
        </Row>

        {/* Vision Section */}
        <Row className="align-items-center flex-md-row-reverse mb-5">
          <Col md={6}>
            <img 
              src={aboutImage} 
              className="img-fluid rounded shadow" 
              alt="Smart Parking at UCC"
            />
          </Col>
          <Col md={6}>
            <h3 className="text-accent mb-3">Our Vision</h3>
            <p>
              To establish Urdaneta City University as a <strong>leader in campus parking management</strong>, 
              offering an exclusive, modern, and secure parking system that recognizes and supports 
              the essential roles of professors, deans, and university officials.
            </p>
          </Col>
        </Row>

        {/* Core Values Section */}
        <Row className="text-center">
          <Col md={4}>
            <Card className="about-card p-3 mb-4 shadow-sm">
              <h4 className="text-accent">Security</h4>
              <p>
                Parking areas are safeguarded with monitoring systems to protect vehicles 
                and ensure peace of mind for faculty and officials.
              </p>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="about-card p-3 mb-4 shadow-sm">
              <h4 className="text-accent">Efficiency</h4>
              <p>
                Streamlined vehicle registration and organized allocation of spaces 
                reduce congestion and save valuable time for university staff.
              </p>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="about-card p-3 mb-4 shadow-sm">
              <h4 className="text-accent">Exclusivity</h4>
              <p>
                The system is exclusively reserved for professors, deans, and officials, 
                ensuring that priority is given to the university’s academic leaders.
              </p>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AboutUs;
