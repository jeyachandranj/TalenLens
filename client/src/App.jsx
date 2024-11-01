import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Advance from './pages/Advance';
import Lagin from './pages/Login';
import FaceDetection from "./components/FaceDetection";
import Layout from "./components/Layout";
import UserSelect from "./components/UserSelect";
import Protected from "./components/Protected";
import ResumeUpload from './pages/ResumeUpload'
import InterviewInstruction from './pages/InterviewInstruction';
import Start from "./pages/Interview"
import ObjectDetection from './components/ObjectDetection';

function App() {
  const location = useLocation();
  const [resumeData, setResumeData] = useState(null);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Lagin />} />
        <Route path="/resumupload" element={<ResumeUpload/>}/>
        <Route path="/interview1" element={<Advance />} />
        <Route path="/InterviewInstruction" element={<InterviewInstruction/>}/>
        <Route path="/objectDetection" element={<ObjectDetection/>}/>
        <Route path="/interview" element={<Start/>}/>
        <Route path="/" element={<Layout />}>
          <Route path="/uploadface" element={<UserSelect />} />
          <Route path="face" element={<FaceDetection />} />
          <Route path="protected" element={<Protected />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;