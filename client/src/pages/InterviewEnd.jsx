import React from "react";
import TopBar from "./TopBar"; // Assuming TopBar is in the same directory
import completedImage from "../assets/completed.jpg";

const InterviewEnd = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar Component */}
      <TopBar />

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>INTERVIEW END</h1>
        <img
          src={completedImage}
          alt="Interview Completed"
          style={{ width: "80%", maxWidth: "500px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}
        />
        <h2 style={{ fontSize: "20px", fontWeight: "bold", marginTop: "20px" }}>INTERVIEW SUCCESS</h2>
        <p style={{ fontSize: "16px", color: "#555" }}>REPORT WILL BE SHARED IN THE EMAIL</p>
      </div>
    </div>
  );
};

export default InterviewEnd;
