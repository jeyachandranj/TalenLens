import React from 'react';
import TopBar from "./TopBar";
import pfp from "../assets/profile.jpg";


const fullName = localStorage.getItem("name") || "Default Name";
  
// Split the full name into first name and last name
const [firstName, ...lastNameArray] = fullName.split(" ");
const lastName = lastNameArray.join(" ")

const ProfilePage = () => {
  return (
    <>
      <div style={{ marginRight: "400px" }}>
        <TopBar />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          padding: "1rem",
        }}
      >
        <div
          style={{
            width: "90%", // Takes 90% of the screen width
            maxWidth: "40rem", // Limits the width for large screens
            border: "1px solid #e5e7eb",
            borderRadius: "0.5rem",
            overflow: "hidden",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Optional shadow for aesthetics
            backgroundColor: "#fff", // White background for contrast
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem",
              backgroundColor: "#f3f4f6",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <img
                src={pfp}
                alt="Profile"
                style={{
                  width: "4rem",
                  height: "4rem",
                  borderRadius: "50%",
                }}
              />
              <div>
                <h2
                  style={{
                    fontSize: "1.25rem", // Slightly larger font size
                    fontWeight: "600",
                    marginBottom: "0.25rem",
                  }}
                >
                  {localStorage.getItem("name")}
                </h2>
                <p style={{ color: "#6b7280" }}>{localStorage.getItem("email")}</p>
              </div>
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", // Responsive columns
              gap: "1rem",
              padding: "1rem",
            }}
          >
            <div>
            <label
              style={{
                display: "block",
                fontWeight: "500",
                color: "#4b5563",
                marginBottom: "0.25rem",
              }}
            >
              First Name
              </label>
              <p
                style={{
                  border: "1px solid #d1d5db",
                  padding: "0.5rem",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                  lineHeight: "1.25rem",
                  width: "100%",
                  margin: 0, // Ensure no extra margins
                }}
              >
                {firstName}
              </p>
            </div>
            <div>
            <label
                style={{
                  display: "block",
                  fontWeight: "500",
                  color: "#4b5563",
                  marginBottom: "0.25rem",
                }}
              >
                Last Name
              </label>
              <p
                style={{
                  border: "1px solid #d1d5db",
                  padding: "0.5rem",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                  lineHeight: "1.25rem",
                  width: "100%",
                  margin: 0, // Ensure no extra margins
                }}
              >
                {lastName}
              </p>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: "500",
                  color: "#4b5563",
                  marginBottom: "0.25rem",
                }}
              >
                Gmail
              </label>
              <p
                style={{
                  border: "1px solid #d1d5db",
                  padding: "0.5rem",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                  lineHeight: "1.25rem",
                  width: "100%",
                  margin: 0, // Ensure no extra margins
                }}
              >
                {localStorage.getItem("email")}
              </p>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: "500",
                  color: "#4b5563",
                  marginBottom: "0.25rem",
                }}
              >
                Mobile No (optional)
              </label>
              <input
                type="tel"
                defaultValue="9999999"
                style={{
                  border: "1px solid #d1d5db",
                  padding: "0.5rem",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                  lineHeight: "1.25rem",
                  width: "100%",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
