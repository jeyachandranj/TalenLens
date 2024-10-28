import React, { useState } from 'react';
import { Button, Alert } from 'reactstrap';
import { PersonCircle, HouseDoorFill, PlusCircle, GearFill, BoxArrowRight } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom'; // Assuming you're using React Router for navigation
import './TopBar.css';
import Logo from '../assets/logo.png';

const TopBar = () => {
  const [showForm, setShowForm] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // State for showing/hiding alert
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    window.location.pathname = "/";
  };

  const goHome = () => {
    navigate("/resumupload"); // Navigate to home page
  };

  return (
    <div className="sidebar">
      <div className="top-section">
        <img
          src={Logo}
          alt="SolveMeter Logo"
          className="org-logo"
          style={{ borderRadius: '10px', marginLeft: '5px', width: '70px', height: '80px', marginBottom: '10px' }}
        />
        <div
          className="profile-section"
          onMouseEnter={() => setShowAlert(true)} // Show alert on hover
          onMouseLeave={() => setShowAlert(false)} // Hide alert when mouse leaves
        >
          <PersonCircle className="profile-icon" />
        </div>
        <div className="home-icon" onClick={goHome}>
          <HouseDoorFill className="sidebar-icon" />
        </div>
        <div className="add-icon" onClick={() => setShowForm(!showForm)}>
          <PlusCircle className="sidebar-icon" />
        </div>
      </div>

      <div className="bottom-section">
        <div className="settings-icon">
          <GearFill className="sidebar-icon" />
        </div>
        <div className="logout-icon" onClick={logout}>
          <BoxArrowRight className="sidebar-icon" />
        </div>
      </div>

      {/* Conditionally render the Alert based on hover */}
      {showAlert && (
        <Alert color="success" className="welcome-alert">
          Welcome {localStorage.getItem("name")}
        </Alert>
      )}

      {/* Display Form when 'Create' button is clicked */}
    </div>
  );
};

export default TopBar;