import React, { useState, useEffect } from 'react';
import PhoneDetectionComponent from '../components/ObjectDetection';
import { useNavigate } from 'react-router-dom';
import Advance from "./Advance";
const RoundsComponent = () => {
  const [isPhoneDetected, setIsPhoneDetected] = useState(false);
  const [timer, setTimer] = useState(0);
  const [currentRound, setCurrentRound] = useState("Technical");
  const [popupMessage, setPopupMessage] = useState('');
  const navigate = useNavigate(); 
  const totalTime = 30 * 60; // Total interview time in seconds (30 minutes)
  const roundDurations = {
    Technical: 10 * 60,
    Project: 10 * 60,
    HR: 10 * 60,
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);

    // Update the current round based on the time elapsed
    if (timer >= 20 * 60 && currentRound !== "HR") {
      setPopupMessage('You have completed the Project round. Next round is HR.');
      setCurrentRound("HR");
    } else if (timer >= 10 * 60 && timer < 20 * 60 && currentRound !== "Project") {
      setPopupMessage('You have completed the Technical round. Next round is Project.');
      setCurrentRound("Project");
    } else if (timer < 10 * 60 && currentRound !== "Technical") {
      setCurrentRound("Technical");
    }
    localStorage.setItem("round", currentRound);

    if (timer >= totalTime) {
      clearInterval(interval); 
      setPopupMessage('Interview process is completed. Thank you!');
      navigate('/interviewend'); 
    }

    return () => clearInterval(interval); 
  }, [timer, currentRound, navigate]); 

  const getCircleProgress = () => {
    return (timer / totalTime) * 100;
  };
  const closePopup = () => setPopupMessage('');

  const isRoundCompleted = (round) => {
    switch (round) {
      case "Technical":
        return timer >= roundDurations.Technical;
      case "Project":
        return timer >= roundDurations.Technical + roundDurations.Project;
      case "HR":
        return timer >= roundDurations.Technical + roundDurations.Project + roundDurations.HR;
      default:
        return false;
    }
  };

  const containerStyle = {
    display: 'flex',
    height: '100vh',
    backgroundColor: 'lightblue',
    position: 'relative',
  };

  const sidebarStyle = {
    width: '300px',
    height: 'auto',
    backgroundColor: '#ffffff',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: '0px 40px 40px 0px',
    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
  };
  const popup= {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
    zIndex: 1000,
  };
 const  popupText={
    marginBottom: '15px',
    fontSize: '16px',
    color: '#333',
  };
  const popupButton= {
    padding: '10px 20px',
    borderRadius: '5px',
    backgroundColor: '#4b9eff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  };
  const overlay ={
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  };
  const timerCircleStyle = {
    position: 'relative',
    width: '150px',
    height: '150px',
    marginBottom: '30px',
  };

  const timerTextStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
  };

  const buttonStyle = (round) => ({
    width: '150px',
    padding: '10px',
    margin: '5px 0',
    borderRadius: '20px',
    backgroundColor: isRoundCompleted(round) ? 'green' : 'lightblue',
    color: 'block',
    fontWeight: 'bold',
    textAlign: 'center',
    cursor: 'default',
  });

  const contentStyle = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: "50px",
    backgroundColor: 'lightblue',
    height: "500px",
    borderRadius: '40px',
    marginBottom:'650px'
  };
  const calculateTimeLeft = (totalTime, timer) => {
    const timeLeft = totalTime - timer;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div style={containerStyle}>
      {popupMessage && (
        <>
          <div style={overlay} onClick={closePopup}></div>
          <div style={popup}>
            <p style={popupText}>{popupMessage}</p>
            <button style={popupButton} onClick={closePopup}>
              OK
            </button>
          </div>
        </>
      )}
      <div style={sidebarStyle}>
        <div style={{ fontSize: '30px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '30px' }}>ROUNDS</div>
        <div style={buttonStyle("Technical")}>Technical </div>
        <div style={buttonStyle("Project")}>Project </div>
        <div style={buttonStyle("HR")}>HR </div>

        <div style={timerCircleStyle}>
          <svg width="150" height="150">
            <circle
              cx="75"
              cy="75"
              r="60"
              stroke="#e0eaff"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="75"
              cy="75"
              r="60"
              stroke="#4b9eff"
              strokeWidth="10"
              fill="none"
              strokeDasharray="377"
              strokeDashoffset={377 - (377 * getCircleProgress()) / 100}
              strokeLinecap="round"
            />
          </svg>
          <div style={timerTextStyle}>{calculateTimeLeft(totalTime, timer)}</div>
        </div>

        <div style={{ fontSize: '18px', marginBottom: '200px' }}>
          Current Round: {currentRound}
        </div>

        <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: `3px solid ${isPhoneDetected ? '#ff3333' : '#33cc33'}`, marginBottom: '20px' }}>
          <PhoneDetectionComponent onPhoneDetect={setIsPhoneDetected} />
        </div>
      </div>

      <div style={contentStyle}>
        <Advance />
      </div>
    </div>
  );
};

export default RoundsComponent;
