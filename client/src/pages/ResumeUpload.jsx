import React, { useState, useEffect } from "react";
import "./ResumeUpload.css";
import resumupload from "../assets/resumupload.png";
import TopBar from "./TopBar";
import { useNavigate } from "react-router-dom";

const UploadResume = () => {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setName(storedName); // Automatically set name from local storage
    }
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a resume!");
    } else {
      if (name) {
        localStorage.setItem("name", name); // Store name in local storage
      }
      console.log("Resume uploaded:", file);
      navigate("/uploadface");
    }
  };

  return (
    <>
      <div style={{ marginRight: "400px" }}>
        <TopBar />
      </div>
      <div className="upload-container">
        <h2>UPLOAD RESUME</h2>
        <div className="upload-content">
          <div className="upload-image">
            <img
              src={resumupload}
              alt="Upload Illustration"
            />
          </div>
          <div className="upload-form">
            <h3>ENTER THE DETAILS</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Resume</label>
                <div className="upload-box">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <div className="upload-text">
                    Drag & drop files or <span>Browse</span>
                    <br />
                    Supported formats: PDF
                  </div>
                </div>
              </div>
              <button type="submit" className="upload-btn">Upload</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadResume;
