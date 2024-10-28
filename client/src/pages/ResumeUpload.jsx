import React, { useState } from "react";
import "./ResumeUpload.css";
import resumupload from "../assets/resumupload.png"
import TopBar from "./TopBar";

const UploadResume = () => {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a resume!");
    } else {
      console.log("Resume uploaded:", file);
    }
  };

  return (
    <>
    <div style={{marginRight:"400px"}}>
    <TopBar/>
  </div>
    <div className="upload-container">
     
      <h2>UPLOAD RESUME</h2>
      <div className="upload-content">
        <div className="upload-image">
          <img
            src={resumupload} // Replace with actual image URL
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
