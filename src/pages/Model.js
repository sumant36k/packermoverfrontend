import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Modal.css"; // Add a separate CSS file for modal styling
import { useNavigate } from "react-router-dom";

const Modal = ({ isOpen, closeModal, distance, activeTab, shiftingDate, fromAddress, toAddress }) => {
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState("");
  const [continueProcess, setContinueProcess] = useState(false);

  useEffect(() => {
    if (continueProcess) {
      handleContinue();
    }
  }, [continueProcess]);

  const handleContinue = async () => {
    if (!mobileNumber || mobileNumber.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      // 🔹 Step 1: Check if Mobile Number Exists
      const checkResponse = await axios.get(`https://localhost:7148/api/User/CheckUser/${mobileNumber}`);

      if (checkResponse.status === 200) {
        // User exists ✅, store userID and navigate
        localStorage.setItem("userID", checkResponse.data.userID);
         alert("User exists, proceeding with booking:", checkResponse.data);
        console.log("User exists, proceeding with booking:", checkResponse.data);
        closeModal();
        navigate(`/booking?distance=${distance}&activeTab=${activeTab}&shiftingDate=${shiftingDate}`);
      } else {
        // 🔹 Step 2: If User Does Not Exist, Create New User
        const userDetails = {
          name: "Default Name",
          phoneNumber: mobileNumber,
          email: "default@example.com",
          password: "defaultPassword",
          Address: {
            fromAddress: fromAddress,
            toAddress: toAddress,
          },
        };

        const createResponse = await axios.post(
          "https://localhost:7148/api/User/CreateUser",
          userDetails,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        if (createResponse.status === 200 || createResponse.status === 201) {
          // New user created ✅, store userID and navigate
          localStorage.setItem("userID", createResponse.data.userID);
          localStorage.setItem("addressID", createResponse.data.addressID);
          console.log("New user created successfully:", createResponse.data);
          closeModal();
          navigate(`/booking?distance=${distance}&activeTab=${activeTab}&shiftingDate=${shiftingDate}`);
        } else {
          alert("Failed to create user. Unexpected response from server.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing your request.");
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;

    // Allow only numbers and limit to 10 digits
    if (/^\d{0,10}$/.test(value)) {
      setMobileNumber(value);
    }
  };

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
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="button" className="modal-submit-btn" onClick={() => setContinueProcess(true)}>
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
