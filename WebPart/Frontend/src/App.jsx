import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [customerId, setCustomerId] = useState(""); // State for storing customerId
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // State for storing OTP digits (6 digits)
  const [resMessage, setResMessage] = useState(""); // State for response message

  const handleChange = (e, index) => {
    const { value } = e.target;
    const newOtp = [...otp];
    newOtp[index] = value; // Update the OTP state for the specific digit
    setOtp(newOtp);

    // Auto-focus the next input field
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerId) {
      alert("Customer ID is required!");
      return;
    }

    try {
      // Call the backend API
      const response = await axios.post("http://localhost:3000/generate-otp", {
        customerId,
      });

      if (response.data && response.data.otp) {
        // Split OTP digits and update the state
        const otpDigits = response.data.otp.toString().split(""); // Convert OTP to an array of digits
        setOtp(otpDigits);
        setResMessage(response.data.message || "OTP generated successfully!");
      }
    } catch (error) {
      console.error("Error generating OTP:", error);
      setResMessage("Failed to generate OTP. Please try again.");
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="card">
          <h1>OTP Generator</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label>
                Customer ID:
                <input
                  className="input-field"
                  type="text"
                  name="customerId"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  placeholder="Enter Customer ID"
                />
              </label>
            </div>

            <div className="otp-input">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  className="otp-input-field"
                  disabled // Disable manual editing
                />
              ))}
            </div>

            <button className="submit-btn" type="submit">
              Generate OTP
            </button>
          </form>

          <div className="response">
            <p>{resMessage}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
