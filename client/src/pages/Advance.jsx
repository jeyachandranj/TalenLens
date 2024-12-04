import { Canvas } from "@react-three/fiber";
import { Experience } from "../components/Experience";
import UserInput from "../components/UserInput";
import { useState,useEffect } from "react";
import Modal from "../components/Modal"; 
import './Advance.css';
import logo from '../assets/loding.gif';

function App() {
  const [response, setResponse] = useState({
    response: "Hello, thank you for having me here today. I'm excited to learn more about this opportunity.",
    speechData: {
      audioFilePath: "",
      visemes: null,
    },
  });

  const [isChatbotReady, setIsChatbotReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenModal, setShowFullscreenModal] = useState(false);

  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };

  const requestFullscreen = () => {
    const elem = document.documentElement; 
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { 
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { 
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { 
      elem.msRequestFullscreen();
    }
    setShowFullscreenModal(false); 
  };
  const [isTabInactive, setIsTabInactive] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const message = "Are you sure you want to leave? Your work might be lost.";
      event.returnValue = message; 
      return message; 
    };
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsTabInactive(true);
        alert("Warning: You switched to another tab!"); 
      } else {
        setIsTabInactive(false);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    setIsFullscreen(!!document.fullscreenElement);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("msfullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!isFullscreen) {
      setShowFullscreenModal(true);
    }
  }, [isFullscreen]);

  return (
    <div className="main-container" data-chatbot-ready={isChatbotReady} >
        <Modal 
          isOpen={showFullscreenModal} 
          onClose={() => setShowFullscreenModal(false)} 
          onConfirm={requestFullscreen} 
        />
      {!isChatbotReady && (
        <div className="loading-overlay">hi hello how are you
          <img src = {logo} alt="Loading..." className="loading-gif" />
        </div>
      )}
      <div className="canvas-wrapper" style={{borderRadius:"30px",}}>
        <Canvas shadows camera={{ position: [0, 0, 8], fov: 42 }} className="canvas">
          <color attach="background" args={["#ececec"]} />
          <Experience response={response} />
        </Canvas>
        <div style={{marginBottom:"350px"}}>
        <UserInput setResponse={setResponse} isChatbotReady={isChatbotReady} setIsChatbotReady={setIsChatbotReady} response={response} />
        </div>
      </div>
    </div>
  );
}

export default App;
