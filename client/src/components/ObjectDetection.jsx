import React, { useEffect, useRef, useState } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

const PhoneDetectionComponent = ({ onPhoneDetect }) => {
  const videoRef = useRef(null);
  const [model, setModel] = useState(null);

  // Load the COCO-SSD model when the component mounts
  useEffect(() => {
    cocoSsd.load().then((loadedModel) => {
      setModel(loadedModel);
    });
  }, []);

  // Set up the webcam feed
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      });
    }
  }, []);

  // Detect objects using the model
  useEffect(() => {
    if (model && videoRef.current) {
      const detectObjects = async () => {
        const predictions = await model.detect(videoRef.current);

        let phoneDetected = false;
        predictions.forEach((prediction) => {
          if (prediction.class === 'cell phone') {
            phoneDetected = true;
          }
        });

        // Update the detection status
        onPhoneDetect(phoneDetected);

        // Keep detecting in real time
        requestAnimationFrame(detectObjects);
      };

      detectObjects();
    }
  }, [model, onPhoneDetect]);

  const webcamStyle = {
    position: 'absolute',
    bottom: '20px',
    left: '30px',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    border: '3px solid #33cc33', // Default to green border, changes in parent
    overflow: 'hidden',
  };

  return (
    <div style={webcamStyle}>
      <video ref={videoRef} style={{ width: '200px', height: '220px',marginBottom:"100px",    borderRadius: '80%',}} />
    </div>
  );
};

export default PhoneDetectionComponent;
