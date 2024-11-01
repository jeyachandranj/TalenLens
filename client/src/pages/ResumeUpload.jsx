import React, { useState, useEffect } from "react";
import "./ResumeUpload.css";
import resumupload from "../assets/resumupload.png";
import TopBar from "./TopBar";
import { useNavigate } from "react-router-dom";
import { getDocument } from "pdfjs-dist/build/pdf";

const UploadResume = () => {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(""); // State to hold the file name
  const [pdfText, setPdfText] = useState(""); // State to hold the PDF text
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setName(storedName); // Automatically set name from local storage
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name); // Set the file name in state
      extractTextFromPDF(selectedFile); // Extract text when a file is selected
    }
  };

  const extractTextFromPDF = async (file) => {
    const fileReader = new FileReader();
    fileReader.onload = async (event) => {
      const typedArray = new Uint8Array(event.target.result);
      const pdf = await getDocument(typedArray).promise;
      let text = "";

      for (let i = 0; i < pdf.numPages; i++) {
        const page = await pdf.getPage(i + 1);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(" ");
        text += pageText + " "; // Accumulate text from all pages
      }

      setPdfText(text.trim()); // Set the PDF text in state
      console.log("Extracted PDF Text:", pdfText);
    };

    fileReader.readAsArrayBuffer(file); // Read the file as an array buffer
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a resume!");
      return;
    }
  
    if (name) {
      localStorage.setItem("name", name); // Store name in local storage
    }
  
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("fileName", fileName); // Add the file name to the form data
  
    try {
      const response = await fetch("http://ec2-13-201-4-41.ap-south-1.compute.amazonaws.com:80/upload", {
        method: "POST",
        body: formData,
      });
  
      const result = await response.json();
      if (response.ok) {
        console.log("Resume uploaded:", file);
        console.log("Uploaded file name:", result.fileName); // Log the uploaded file name
        navigate("/uploadface");
      } else {
        alert("File upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred during file upload.");
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
