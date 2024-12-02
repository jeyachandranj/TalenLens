// Modal.js
import React from 'react';
import './Modal.css';

function Modal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Fullscreen Required</h2>
        <p>This application works best in fullscreen mode. Please switch to fullscreen for the best experience.</p>
        <div className="modal-buttons">
          <button onClick={onConfirm} style={{width:"200px"}}>Go Fullscreen</button>
          {/* <button onClick={onClose}>Cancel</button> */}
        </div>
      </div>
    </div>
   
  );
}

export default Modal;
