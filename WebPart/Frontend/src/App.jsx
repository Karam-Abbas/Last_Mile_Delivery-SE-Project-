import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [customerId, setCustomerId] = useState(""); // State for storing customerId
  const [res, setRes] = useState({}); // State for storing the response

  const handleChange = (e) => {
    const { value } = e.target; // Extract the value from the input event
    setCustomerId(value); // Update customerId state
  };

  async function getUser() {
    try {
      const response = await axios.post("http://localhost:3000/generate-otp", {
        customerId, // Pass the customerId in the request body
      });
      console.log(response.data); // Log the response data
      setRes(response.data); // Update response state with the server response
    } catch (error) {
      console.error("Error generating OTP:", error);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!customerId) {
      alert("Customer ID is required!");
      return;
    }
    getUser(); // Call the function to make the API request
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Customer ID:
            <input
              className="border border-solid border-black"
              type="text"
              name="customerId"
              value={customerId} // Bind value to customerId state
              onChange={handleChange} // Update customerId state on change
              placeholder="Enter Customer ID"
            />
          </label>
        </div>
        <button
          className="border border-solid border-black"
          type="submit" // Correct button type for form submission
        >
          Generate OTP
        </button>
      </form>
      <div>
        <p>OTP: {res.otp || "No OTP yet"}</p>
        {res.message && <p>Message: {res.message}</p>} {/* Display server message */}
      </div>
    </div>
  );
}

export default App;
