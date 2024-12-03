import React, { useState, useEffect } from 'react';
import PhoneDetectionComponent from '../components/ObjectDetection';
import { useNavigate } from 'react-router-dom';

import Advance from './Advance';

const RoundsComponent = () => {
  const [isPhoneDetected, setIsPhoneDetected] = useState(false);
  const [timer, setTimer] = useState(0);
  const [currentRound, setCurrentRound] = useState('Technical');
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


    if (timer === roundDurations.Technical) {
      setPopupMessage('You have completed the Technical round. Next round is Project.');
      setCurrentRound('Project');
    } else if (timer === roundDurations.Technical + roundDurations.Project) {
      setPopupMessage('You have completed the Project round. Next round is HR.');
      setCurrentRound('HR');
    } else if (timer === totalTime) {
      setPopupMessage('Interview process is completed. Thank you!');
    }


    if (timer >= totalTime) {
      clearInterval(interval); 
      navigate('/interviewend'); 
    }


  const getCircleProgress = () => (timer / totalTime) * 100;

  const calculateTimeLeft = (totalTime, timer) => {
    const timeLeft = totalTime - timer;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  };

  const closePopup = () => setPopupMessage('');

  const isRoundCompleted = (round) => {
    switch (round) {
      case 'Technical':
        return timer >= roundDurations.Technical;
      case 'Project':
        return timer >= roundDurations.Technical + roundDurations.Project;
      case 'HR':
        return timer >= totalTime;
      default:
        return false;
    }
  };


  return (
    <div style={styles.container}>
      {popupMessage && (
        <>
          <div style={styles.overlay} onClick={closePopup}></div>
          <div style={styles.popup}>
            <p style={styles.popupText}>{popupMessage}</p>
            <button style={styles.popupButton} onClick={closePopup}>
              OK
            </button>
          </div>
        </>
      )}
      <div style={styles.sidebar}>
        <h1 style={styles.title}>ROUNDS</h1>
        <div style={getButtonStyle('Technical', currentRound, isRoundCompleted('Technical'))}>Technical</div>
        <div style={getButtonStyle('Project', currentRound, isRoundCompleted('Project'))}>Project</div>
        <div style={getButtonStyle('HR', currentRound, isRoundCompleted('HR'))}>HR</div>

        <div style={styles.timerCircle}>

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
    padding: "100px",
    backgroundColor: 'lightblue',
    height: "500px",
    borderRadius: '40px',
  };
  const calculateTimeLeft = (totalTime, timer) => {
    const timeLeft = totalTime - timer;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div style={containerStyle}>
      <div style={sidebarStyle}>
        <div style={{ fontSize: '30px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '30px' }}>ROUNDS</div>
        <div style={buttonStyle("Technical")}>Technical </div>
        <div style={buttonStyle("Project")}>Project </div>
        <div style={buttonStyle("HR")}>HR </div>

        <div style={timerCircleStyle}>

          <svg width="150" height="150">
            <circle cx="75" cy="75" r="60" stroke="#e0eaff" strokeWidth="10" fill="none" />
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
          <div style={styles.timerText}>{calculateTimeLeft(totalTime, timer)}</div>
        </div>
        <div style={{ marginTop: '30px' }}>
          <PhoneDetectionComponent onPhoneDetect={setIsPhoneDetected} />
        </div>
      </div>

      <div style={styles.mainContent}>
        <Advance />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
  },
  sidebar: {
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
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    marginBottom: '20px',
    color: '#333',
  },
  popup: {
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
  },
  popupText: {
    marginBottom: '15px',
    fontSize: '16px',
    color: '#333',
  },
  popupButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    backgroundColor: '#4b9eff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  timerCircle: {
    position: 'relative',
    width: '150px',
    height: '150px',
    marginBottom: '200px',
  },
  timerText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    height:'100vh',
    width:'50vw',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1px',
  },
};

const getButtonStyle = (round, currentRound, isCompleted) => ({
  width: '200px',
  padding: '10px',
  margin: '5px 0',
  borderRadius: '20px',
  backgroundColor: isCompleted ? '#28a745' : round === currentRound ? '#ffcc00' : '#f0f0f0',
  color: round === currentRound ? '#333' : '#666',
  fontWeight: 'bold',
  textAlign: 'center',
  cursor: 'default',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
});

export default RoundsComponent;