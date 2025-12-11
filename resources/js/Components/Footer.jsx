import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { BsEnvelopeFill, BsTelephoneFill, BsGeoAltFill, BsFacebook, BsInstagram, BsTwitter } from "react-icons/bs";
import logoP from '../../../Images/logo-1.png';
import '../../css/Components/footer.css';

const Footer = () => {
  return (
    <footer className="footer-section text-white pt-5 pb-3">
      <Container>
        <Row className="mb-5">
          {/* Logo & About */}
          <Col md={4} className="mb-4">
            <div className="d-flex align-items-center mb-3">
              <img src={logoP} alt="PASOK Logo" className="brand-logo-hero me-2" />
              <h5 className="fw-bold mb-0">PASOK</h5>
            </div>
            <p className="footer-about">
              Parking Assignment System and Online Kit – secure and efficient parking for UCC professors, deans, and officials.
            </p>
            <div className="social-icons mt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="me-2 text-white">
                <BsFacebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="me-2 text-white">
                <BsInstagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white">
                <BsTwitter size={20} />
              </a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col md={4} className="mb-4">
            <h5 className="fw-bold mb-3">Quick Links</h5>
            <Row>
              <Col xs={6}>
                <ul className="footer-links">
                  <li><a href="/">Home</a></li>
                  <li><a href="/book-parking">Book Parking</a></li>
                  <li><a href="/booking-history">Booking History</a></li>
                  <li><a href="/vehicle-registration">Vehicle Registration</a></li>
                </ul>
              </Col>
              <Col xs={6}>
                <ul className="footer-links">
                  <li><a href="/parking-map">Parking Map</a></li>
                  <li><a href="/about">About Us</a></li>
                  <li><a href="/privacy-policy">Privacy Policy</a></li>
                  <li><a href="/terms-of-service">Terms of Service</a></li>
                </ul>
              </Col>
            </Row>
          </Col>

          {/* Contact Info */}
          <Col md={4} className="mb-4">
            <h5 className="fw-bold mb-3">Contact Info</h5>
            <p><BsEnvelopeFill className="me-2"/> info@pasok.com</p>
            <p><BsTelephoneFill className="me-2"/> (123) 456-7890</p>
            <p><BsGeoAltFill className="me-2"/> Urdaneta City University, Pangasinan</p>
            <p className="small text-muted">Office Hours: Mon-Fri, 8AM - 5PM</p>
          </Col>
        </Row>

        <hr className="footer-divider" />

        {/* Stay Connected Section */}
        <Row className="mb-5">
          <Col md={6} className="mx-auto text-center">
            <h5 className="fw-bold mb-3">Stay Connected</h5>
            <p className="footer-about">
              Enter your email to receive updates and announcements about PASOK.
            </p>
            <Form className="d-flex justify-content-center" onSubmit={(e) => e.preventDefault()}>
              <Form.Control 
                type="email" 
                placeholder="Enter your email" 
                className="me-2 w-50 rounded-pill"
              />
              <Button variant="primary" type="submit" className="rounded-pill px-4">
                Subscribe
              </Button>
            </Form>
          </Col>
        </Row>

        {/* Bottom Row */}
        <Row>
          <Col className="text-center">
            <p className="mb-0 small text-secondary">
              &copy; {new Date().getFullYear()} <strong>PASOK</strong>. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
