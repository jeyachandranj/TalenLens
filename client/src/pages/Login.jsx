import React, { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase"; // Import your Firebase auth configuration
import "./Login.css";
import CenterImage from "../assets/main.png";
import Logo from "../assets/logo.png";
import { FaBars } from "react-icons/fa";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scale, setScale] = useState(1.9);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const provider = new GoogleAuthProvider();

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;

      setUser(user);
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("email", user.email);
      localStorage.setItem("name", user.displayName);
      window.location.pathname = "/resumupload"; // Redirect after sign-in
    } catch (error) {
      setError(error.message);
      console.error("Google sign-in error:", error);
    } finally {
      setIsSigningIn(false);
    }
  };

  // Check if the user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="gradient">
      <header className="navbar" style={{ backgroundColor: "white", color: "black" }}>
        <div className="logo-container">
          <img
            src={Logo}
            alt="SolveMeter Logo"
            className="logo"
            style={{
              width: "100px",
              height: "80px",
              marginTop:"20px",
              marginLeft:"20px",
              transform: `scale(${scale})`,
              transition: "transform 0.3s ease",
            }}
          />
          <span className="logo-text" style={{ fontSize: "40px", marginLeft: "35px", fontFamily: "Cursive" }}>
            TalentLens
          </span>
        </div>

        <nav>
          <FaBars className="menu-icon" onClick={toggleMenu} />
          <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
            <li>Home</li>
            <li>About</li>
            <li>Service</li>
            <li>Contact</li>
          </ul>
        </nav>
      </header>

      <div className="main-content">
        <img src={CenterImage} alt="centered content" className="center-image" />
        <button onClick={handleGoogleSignIn} disabled={isSigningIn} className="googlebutton mt-4 rounded-pill">
          {isSigningIn ? "Signing in..." : <b>Sign in with Google</b>}
        </button>
        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
};

export default LandingPage;