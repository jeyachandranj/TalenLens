import React, { useState, useEffect } from "react";
import "./ResumeUpload.css";
import resumupload from "../assets/resumupload.png";
import TopBar from "./TopBar";
import { useNavigate } from "react-router-dom";
import { getDocument } from "pdfjs-dist/build/pdf";

const UploadResume = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("Student"); 
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(""); 
  const [pdfText, setPdfText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    const storedRole = localStorage.getItem("role");
    const storedAdditionalInfo = localStorage.getItem("additionalInfo");
    const storedFileName = localStorage.getItem("fileName");

    if (storedName) setName(storedName);
    if (storedRole) setRole(storedRole);
    if (storedAdditionalInfo) setAdditionalInfo(storedAdditionalInfo);
    if (storedFileName) setFileName(storedFileName);
  }, []);

 
  useEffect(() => {
    localStorage.setItem("name", name);
  }, [name]);

  useEffect(() => {
    localStorage.setItem("role", role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem("additionalInfo", additionalInfo);
  }, [additionalInfo]);

  useEffect(() => {
    localStorage.setItem("fileName", fileName);
  }, [fileName]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name); 
      extractTextFromPDF(selectedFile);
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
        const pageText = content.items.map((item) => item.str).join(" ");
        text += pageText + " "; 
      }

      setPdfText(text.trim()); 
      console.log("Extracted PDF Text:", pdfText);
    };

    fileReader.readAsArrayBuffer(file); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a resume!");
      return;
    }
  
    if (!name.trim()) {
      alert("Please enter your name!");
      return;
    }

    if (name) {
      localStorage.setItem("name", name);
    }

    const customFileName = `${name.replace(/\s+/g, "_")}.pdf`;

    const renamedFile = new File([file], customFileName, { type: file.type });

    const formData = new FormData();
    formData.append("resume", renamedFile);
    formData.append("fileName", customFileName);
    formData.append("role", role);
    formData.append("additionalInfo", additionalInfo);
    
  
    try {
      const uploadResponse = await fetch("https://ai-interview-talenlens.onrender.com/upload", {
        method: "POST",
        body: formData,
      });
  
      const uploadResult = await uploadResponse.json();
      if (uploadResponse.ok) {
        const email = localStorage.getItem("email");
        console.log("Resume uploaded:", file);
        console.log("Uploaded file name:", uploadResult.fileName); 
        const userData = {
          name: name,
          email:email,
          role: role,
          additionalInfo: additionalInfo
        };
  
        const response = await fetch("http://localhost:3000/upload-resume", { // Make sure this matches your backend URL
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
  
        const result = await response.json();
        if (response.ok) {
          console.log("User data saved:", result.user);
          navigate("/uploadface");
        } else {
          alert("Failed to save user data.");
        }
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
            <img src={resumupload} alt="Upload Illustration" />
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
                <label>Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="Student">Student</option>
                  <option value="Employee">Employee</option>
                </select>
              </div>
              <div className="form-group">
                <label>
                  {role === "Student" ? "College Name" : "Last Worked Company"}
                </label>
                <input
                  type="text"
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder={
                    role === "Student"
                      ? "Enter your college name"
                      : "Enter your last company name"
                  }
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
                {fileName && <p className="uploaded-file-name">Uploaded: {fileName}</p>}
              </div>
              <button type="submit" className="upload-btn">
                Upload
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadResume;