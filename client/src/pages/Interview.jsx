import React, { useState } from 'react';
import PhoneDetectionComponent from '../components/ObjectDetection';
import Advance from "./Advance"

const RoundsComponent = () => {
  const [isPhoneDetected, setIsPhoneDetected] = useState(false);

  const containerStyle = {
    display: 'flex',
    height: '100vh',
    backgroundColor: 'lightblue',
    position: 'relative',
  };

  const sidebarStyle = {
    width: '250px',
    backgroundColor: 'white',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: 'black',
    borderRadius: '0px 40px 40px 0px',
  };

  const sidebarTitleStyle = {
    fontSize: '30px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    marginBottom: '50px',
  };

  const roundButtonStyle = (color) => ({
    backgroundColor: '#e0eaff',
    color: '#000',
    padding: '10px 20px',
    borderRadius: '40px',
    margin: '10px 0',
    width: '100%',
    textAlign: 'center',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    marginBottom:"130px",
    justifyContent: 'space-between',
  });

  const dotStyle = (detected) => ({
    backgroundColor: detected ? '#ff3333' : '#33cc33',
    borderRadius: '50%',
    width: '10px',
    height: '10px',
  });

  const profilePictureStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    border: `3px solid ${isPhoneDetected ? '#ff3333' : '#33cc33'}`,
    marginBottom: '20px',
  };

  const contentStyle = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding:"100px",
    backgroundColor:'lightblue',
    height:"600px",
    borderRadius: '40px',
  };

 

  return (
    <div style={containerStyle}>
      <div style={sidebarStyle}>
        <div style={sidebarTitleStyle}>ROUNDS</div>
        <div style={roundButtonStyle(isPhoneDetected)}>
          Technical <span style={dotStyle(isPhoneDetected)}></span>
        </div>
        <div style={roundButtonStyle(isPhoneDetected)}>Project</div>
        <div style={roundButtonStyle(isPhoneDetected)}>HR</div>
        <div style={profilePictureStyle}>
        <PhoneDetectionComponent onPhoneDetect={setIsPhoneDetected} />
        </div>
      </div>

      <div style={contentStyle}>
        <Advance/>
      </div>

     

    </div>
  );
};

export default RoundsComponent;
