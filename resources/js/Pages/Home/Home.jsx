import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../../../css/Home/home.css';

import logoP from '../../../../Images/logo-1.png';
import logoSchool from '../../../../Images/ucc.png'; 
import FeaturesSection from "../../Components/Home/FeaturesSection";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Check if logged in by token
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setUser({}); // mark as logged in
      navigate('/dashboard'); // redirect automatically
    }
  }, [navigate]);

  const handleButtonClick = () => {
    navigate('/login'); // not logged in: go to login
  };

  return (
    <div className="home-container">
      <div className="home-background">
        <div className="background-overlay"></div>

        <div className="home-content">
          {/* Left Section */}
          <div className="hero-text fade-in">
            <h1 className="hero-title">
              Welcome to <br />
              <img src={logoP} alt="PAS" className="brand-logo-hero me-1" />
              ASOK
            </h1>
            <p className="hero-subtitle">
              Parking Assignment System and Online Kit
            </p>

            {/* Only show button if NOT logged in */}
            {!user && (
              <Button
                className="hero-button"
                size="lg"
                onClick={handleButtonClick}
              >
                Get Started
              </Button>
            )}
          </div>

          {/* Right Section - School Logo */}
          <div className="glass-panel float-up">
            <img 
              src={logoSchool} 
              alt="School Logo" 
              className="school-logo"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <FeaturesSection />
    </div>
  );
};

export default Home;
