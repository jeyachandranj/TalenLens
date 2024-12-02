import React, { useState, useEffect, useRef } from "react";
import { useChatbot } from "./useChatbot";
import debounce from "lodash.debounce";
import SettingsDisplay from "./SettingsDisplay";
import '../pages/Advance.css';

const UserInput = ({ setResponse, isChatbotReady, setIsChatbotReady, response }) => {
  const urlParams = new URLSearchParams(window.location.search);
  let showSettings = urlParams.get("showSettings") || true;

  const interviewStartTime = localStorage.getItem('interviewStartTime');
  const name = localStorage.getItem('name');

  const [visible, setVisible] = useState(showSettings);
  const [settings, setSettings] = useState({
    job_title: urlParams.get("job_title") || "Software Engineer",
    company_name: urlParams.get("company_name") || "Google",
    interviewer_name: urlParams.get("interviewer_name") || "Jeyachandran J",
    link_to_resume: "https://jeyachandranj.github.io/resume/Resume.pdf",
    resume_title: urlParams.get("resume_title") || 'all'
  });

  const { initChatbot, sendMessage, error } = useChatbot(setResponse, settings, setIsChatbotReady);

  useEffect(() => {
    initChatbot().then((ready) => {
      setIsChatbotReady(ready);
    });
  }, [settings]);

  const [speechText, setSpeechText] = useState("");
  const [listening, setListening] = useState(false);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [chunks, setChunks] = useState([]);
  const recognition = useRef(null);
  const inputRef = useRef(null);
  // const [currentStage, setCurrentStage] = useState(1); // Track current stage
  // const [completedStages, setCompletedStages] = useState(0); // Track completed stages
  // const [popupMessage, setPopupMessage] = useState(""); // Popup message for pass/fail
  // const [popupVisible, setPopupVisible] = useState(false);


  useEffect(() => {
    initChatbot().then((ready) => {
      setIsChatbotReady(ready);
    });
  }, [settings]);

  useEffect(() => {
    const apiInterval = setInterval(() => {
      callStageAPI();
    }, 300000);

    return () => clearInterval(apiInterval); // Cleanup on unmount
  }, []);

  // Function to call the API to check the current stage
  // const callStageAPI = async () => {
  //   try {
  //     const currentTime = Date.now();
  //     const interviewDuration = currentTime - interviewStartTime;
  //     console.log("currentTime", currentTime)
  //     console.log("inter startTime", interviewStartTime);
  //     const result = await fetch(`http://localhost:3000/api/evaluateInterview?name=${name}&interviewDuration=${interviewDuration}`);
  //     const data = await result.json();

  //     console.log("api data", data);

  //     if (data) {
  //       setCurrentStage(data.currentStage);
  //       setCompletedStages(data.completedStage);

  //       if (data.status === "pass") {
  //         setPopupMessage("Congratulations! You passed the current stage.");
  //         setPopupVisible(true);
  //       } else if (data.status === "fail") {
  //         setPopupMessage("Sorry, you failed the current stage.");
  //         setPopupVisible(true);

  //       }
  //       setTimeout(() => {
  //         setPopupVisible(false);
  //       }, 5000);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching stage data:", error);
  //   }
  // };

  // const closePopup = () => {
  //   setPopupVisible(false);
  //   setPopupMessage("");
  // };



  const initializeSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      console.log("Your browser does not support speech recognition.");
    } else {
      recognition.current = new window.webkitSpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = "en-US";
      let pauseTimer;
      const PAUSE_THRESHOLD = 3000;
      let lastProcessedText = "";
      recognition.current.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript;
          }
        }
        transcript = transcript.trim();
        clearTimeout(pauseTimer);
        if (transcript && transcript !== lastProcessedText) {
          lastProcessedText = transcript;
          setSpeechText((prevText) => {
            return prevText + (prevText ? " " : "") + transcript;
          });
        }
        pauseTimer = setTimeout(() => {
          setSpeechText((prevText) => {
            lastProcessedText = "";
            return prevText + ". ";
          });
        }, PAUSE_THRESHOLD);
      };
      recognition.current.onerror = (event) => {
        console.log("Speech recognition error:", event.error);
      };
    }
  };

  useEffect(() => {
    initializeSpeechRecognition();
  }, []);




  const debouncedSendMessage = debounce((message) => {
    if (!message) return;
    if (listening) {
      stopListening();
    }
    sendMessage(message);
  }, 500);

  const startListening = () => {
    setListening(true);
    recognition.current && recognition.current.start();
  };

  const stopListening = () => {
    setListening(false);
    recognition.current && recognition.current.stop();
  };

  const toggleListening = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  useEffect(() => {
    if (listening && inputRef.current) {
      inputRef.current.focus();
    }
  }, [listening]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        if (listening) {
          stopListening(); 
        }
        if (speechText !== "") {
          debouncedSendMessage(speechText);
          setSpeechText("");
        }
      }
    };
  
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [speechText, listening]);

  useEffect(() => {
    if (response.response) {
      const words = response.response.split(' ');
      const newChunks = [];
      for (let i = 0; i < words.length; i += 5) { // Group words into chunks of 3
        newChunks.push(words.slice(i, i + 5).join(' '));
      }
      setChunks(newChunks);
      setCurrentChunkIndex(0);
    }
  }, [response.response]);

  useEffect(() => {
    if (chunks.length > 0) {
      const timer = setInterval(() => {
        setCurrentChunkIndex((prevIndex) => {
          if (prevIndex + 1 < chunks.length) {
            return prevIndex + 1;
          } else {
            clearInterval(timer);
            setChunks([]);
            return prevIndex;
          }
        });
      }, 2500);
      return () => clearInterval(timer);
    }
  }, [chunks]);

  useEffect(() => {
    return () => {
      if (recognition.current) {
        recognition.current.stop();
        recognition.current = null;
      }
    };
  }, []);


  

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleInputChange = (e) => {
    setSpeechText(e.target.value);
    autoResize(e.target);
  };

  // Function to auto-resize the textarea
  const autoResize = (element) => {
    element.style.height = "auto";  // Reset the height
    element.style.height = element.scrollHeight + "px";  // Adjust height based on scroll
  };




  return (
    <div className="chatbotInputWrap" style={{ width: "300px" }}>
      {/* <div className="stage-info" style={{ position: "absolute", top: "10px", right: "10px" }}>
        <p>Current Stage: {currentStage}</p>
        <p>Completed Stages: {completedStages}</p>
      </div> */}

      {/* {popupVisible && (
        <div className="popup" style={{ color: "black" }}>
          <div className="popup-content">
            <p>{popupMessage}</p>
          </div>
        </div>
      )} */}

      {chunks.length > 0 && (
        <div
          className="chatbotResponse"
          style={{
            border: "3px solid black",
            backgroundColor: "white",
            marginLeft: "390px",
            padding: "10px",
            fontSize: "20px",
            whiteSpace: "pre-wrap",
          }}
        >
          {chunks[currentChunkIndex]}
        </div>
      )}
      {isChatbotReady ? (
        <section className="chatbotInputContainer">
          <div className="chatbotInput" data-listening={listening}>
            <div className="chatbotInput_container">
              <form onSubmit={(e) => e.preventDefault()} className="inputForm" style={{ marginLeft: "200px",marginBottom:"50px", width: "1400px" }}>
              <div className="microphoneIcon">
                  <button type="button" onClick={toggleListening} className="mic-button" style={{backgroundColour:'black',marginRight:"100px"}}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                   fill="currentColor"
                 className="bi bi-mic-fill"
                      viewBox="0 0 16 16"
                        style={{
                         backgroundColor: 'black', // Add background color
                          borderRadius: '100%',     // Make it circular
                                 // Space between icon and background
                              }}
                            >
                      <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z"></path>
                      <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"></path>
                    </svg>
                  </button>
                </div>

                <textarea
                  ref={inputRef}
                  value={speechText}
                  onChange={handleInputChange}
                  style={{
                    color: "black",
                    backgroundColor: "white",
                    fontSize: "25px",
                    width: "1200px",
                    marginLeft:"150px",
                    height:"150px",
                    maxHeight: "300px",
                    marginTop:"200px",
                    overflow: "hidden",

                  }}
                  placeholder="Speak or type a message..."
                />
              </form>
            </div>
          </div>

          {!visible && (
            <div className="timerDisplay" style={{ marginLeft: "300px" ,marginBottom:"120px"}}>
              {/* <p className="timerText">{formatTime(timer)}</p> */}
            </div>
          )}



          <div className="chatbotSettings" data-visible={visible}>
            <SettingsDisplay
              settings={settings}
              setSettings={setSettings}
              visible={visible}
              setVisible={setVisible}
            />
          </div>
        </section>
      ) : (
        <></>
      )}
    </div>
  );
};

export default UserInput;