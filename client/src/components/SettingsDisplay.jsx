import React, { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom';
import TopBar from '../pages/TopBar';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SettingsDisplay = ({ settings, setSettings, visible, setVisible }) => {
  const formRef = useRef(null);
  const [newSettings, setNewSettings] = useState(settings);
  const [isTabLockActive, setIsTabLockActive] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isTabLockActive) {
        alert("You cannot switch tabs after saving your settings.");
        setTabSwitchCount((prevCount) => prevCount + 1);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isTabLockActive]);

  const handleSave = () => {
    setIsTabLockActive(true);
    console.log("Settings saved and tab switching is now restricted.");
  };

  const updateSettings = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    const updatedSettings = Object.fromEntries(formData.entries());

    const currentTime = Date.now();
    localStorage.removeItem("interviewStartTime");
    localStorage.setItem("interviewStartTime", currentTime);
    localStorage.removeItem("questionStartTime");
    console.log("Interview Started");

    if (validateUrl(e.target.link_to_resume.value)) {
      setSettings(updatedSettings);
      setVisible(false);
      await checkObjectDetection();
    } else {
      console.log("Invalid settings");
      formRef.current.classList.add("invalid");
    }
  };

  function validateUrl(url) {
    try {
      new URL(url);
      if (url.slice(-4) !== ".pdf") {
        console.log("Invalid url");
        return false;
      }
      return true;
    } catch (_) {
      console.log("Invalid url");
      return false;
    }
  }
  const handleStart = () => {
    toast.success("Interview was started!");
    localStorage.setItem("interviewStarted", true); // Store interview state
    setVisible(false);
    navigate("/Interview"); // Navigate to Interview route programmatically
  };

  return (
    <>
    <div style={{ position: "fixed", top: 0, left: 0, width: "200px", zIndex: 1000 }}>
    <ToastContainer />
        <TopBar />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: '50px',
        }}
      >
        <div
          className="settingsContainer"
          style={{
            width: "50%",
            height: '70%',
            marginTop:'35px',
            marginLeft:'30px',
            backgroundColor: "#f3f4f6",
            color: "black",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            padding: "20px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflowY: "auto",
          }}
        >
          <h1
            style={{
              color: "black",
              textAlign: "center",
              marginBottom: "20px", // Add some space at the bottom of the title
            }}
          >
            <strong>RULES</strong>
          </h1>
  
          {/* Beautiful Layout for Rules (Vertical List) */}
          <div
            style={{
              color: "black",
              marginBottom: "20px", // Add some space below the rules
            }}
          >
            <div style={{ marginBottom: "15px" }}>
              <p><strong>1. Start with greetings:</strong> Begin the interview with a greeting.</p>
            </div>
            <div style={{ marginBottom: "15px" }}>
              <p><strong>2. Voice or text responses:</strong> You can respond using voice or text.</p>
            </div>
            <div style={{ marginBottom: "15px" }}>
              <p><strong>3. Using the mic:</strong> Click on the mic icon, speak, then press Enter.</p>
            </div>
            <div style={{ marginBottom: "15px" }}>
              <p><strong>4. Interview Rounds:</strong> The interview consists of 3 rounds, each lasting 10 minutes.</p>
            </div>
            <div style={{ marginBottom: "15px" }}>
              <p><strong>5. Round details:</strong> The rounds are Technical, Project, and HR rounds.</p>
            </div>
          </div>
  
          {/* Success Message */}
          <h4
            className="successMessage"
            style={{
              textAlign: "center",
              color: "black",
              marginBottom: "20px", // Add some space below the message
            }}
          >
            ALL THE BEST!
          </h4>
  
          {/* Start Button */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Link
              to="/Interview"
              onClick={handleStart}
            
              className="inline-flex items-center rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600"
              style={{
                fontSize: "14px", // Smaller font size
                padding: "8px 16px", // Reduce padding
              }}
            >
              Start
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="ml-1.5 h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
  
  
};

export default SettingsDisplay;
