import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Modal.css"; // Add a separate CSS file for modal styling
import { useNavigate } from "react-router-dom";

const Modal = ({ isOpen, closeModal,distance }) => {
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState("");
const [continute,setContinue] =useState(false)
useEffect (()=>{
  if(continute)
  {

  
  // const handleContinue = async () => {
    if (!mobileNumber) {
      alert("Please enter a valid mobile number.");
      return;
    }
    
    try {
      const response =  axios.post(
        "https://localhost:7148/api/User/CreateUser",
        {
          name: "Default Name",
          phoneNumber: mobileNumber,
          email: "default@example.com",
          password: "defaultPassword",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((response)=>{

        if (response.status === 200 || response.status === 201) {
          // User saved successfully
          localStorage.setItem("userID", response.data.userID); // Store userID
          console.log("User saved successfully:", response.data);
  
          // Close the modal and navigate to the booking page
          closeModal();
          //navigate("/booking");
          navigate(`/booking?distance=${distance}`);

        } else {
          console.error("Unexpected response:", response);
          alert("Failed to save the mobile number. Unexpected response from server.");
        }
      });

      
    } catch (error) {
      // Log detailed error information
      if (error.response) {
        // Server responded with a status code outside the 2xx range
        console.error("Backend error:", error.response.data);
        alert(
          `Failed to save the mobile number. Server responded with status: ${error.response.status}`
        );
      } else if (error.request) {
        // No response received from server
        console.error("No response received:", error.request);
        alert("Failed to connect to the server. Please try again later.");
      } else {
        // Error occurred while setting up the request
        console.error("Request setup error:", error.message);
        alert("An error occurred. Please try again.");
      }
    }
  }
 

},[continute]);
 

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={closeModal}>
          &times;
        </button>
        <h2>Enter mobile number to continue</h2>
        <p>Never shared, never spammed.</p>
        <form className="mobile-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <div className="country-code">
              <span>+91</span>
            </div>
            <input
              type="tel"
              placeholder="Enter Mobile Number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />
          </div>
          <button type="button" className="modal-submit-btn" onClick={(e)=>setContinue(true)}>
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
