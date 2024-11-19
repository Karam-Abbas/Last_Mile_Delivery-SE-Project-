import React, { useState } from 'react';
import axios from 'axios';
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    ClientId: '',
});

const [res, setRes] = useState({});

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
};

async function getUser() {
  try {
    const response = await axios.post('http://localhost:3000/generate-otp', { customerId: formData.ClientId });
    console.log(response);
    setRes(response.data);
  } catch (error) {
    console.error(error);
  }
}

const handleSubmit = (e) => {
  e.preventDefault();  
  getUser();
};

return (
  <>
    <form onSubmit={handleSubmit}>
        <div >
            <label>
                Name:
                <input
                    className='border border-solid border-black'
                    type="text"
                    name="ClientId"
                    value={formData.ClientId}
                    onChange={handleChange}
                />
            </label>
        </div>
        <button className='border border-solid border-black' type="Generate OTP">Submit</button>

    </form>
    <div>OTP:
        {res.otp || "No OTP yet"}
    </div>
    </>
);
};

export default App
