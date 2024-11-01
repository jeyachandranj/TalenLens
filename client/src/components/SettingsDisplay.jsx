import React, { useState, useRef, useEffect } from "react";

const SettingsDisplay = ({ settings, setSettings, visible, setVisible }) => {
  const formRef = useRef(null);
  const [newSettings, setNewSettings] = useState(settings);
  const [isTabLockActive,setIsTabLockActive] = useState(false);
  const [tabSwitchCount,setTabSwitchCount] = useState(0);
  const [show,setShow] = useState(false);


  useEffect(() => {
    const handleVisibilityChange = () => {
        if (document.hidden && isTabLockActive) {
            alert('You cannot switch tabs after saving your settings.');
            setTabSwitchCount(prevCount => prevCount + 1);
        }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
}, [isTabLockActive]);

const handleSave = () => {
    setIsTabLockActive(true);
    console.log('Settings saved and tab switching is now restricted.');
};

  const updateSettings = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    const updatedSettings = Object.fromEntries(formData.entries());

    const currentTime = Date.now();
    localStorage.removeItem('interviewStartTime');
    localStorage.setItem('interviewStartTime', currentTime);
    localStorage.removeItem('questionStartTime');
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

  

  

  return (
    <div className="settingsContainer" >
      <h2 style={{ textAlign: "center",color:"white"}}>RULES</h2><br/>  
      <form  onSubmit={updateSettings} ref={formRef} >
        <div >
        <div style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
            <p>• The user must start with greetings for the interview.</p>
            <p>• To respond to each question, the user can answer either by voice or text. To use the mic, click on the mic icon, speak, and then press Enter upon completion.</p>
            <p>• The interview consists of 3 rounds, each lasting 10 minutes.</p>
            <p>• The first round is the Technical Round, the second is the Project Round, and the third is the HR Round.</p>
            <h4 style={{ color: 'green', fontWeight: 'bold', textAlign: 'center', marginTop: '20px' }}>
  ALL THE BEST !
</h4><br/>
          </div>

          <button className="btn_outline" type="submit" style={{ width: "300px" }}  onClick={() => setVisible(false)}>
            Start
          </button>
         
        </div>
      </form> 
    </div>
  );
};

export default SettingsDisplay;
