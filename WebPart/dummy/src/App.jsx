import React, { useState } from 'react';
import axios from 'axios';
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    ClientId: '',
});

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
};

const handleSubmit = (e) => {
    e.preventDefault();
    async function getUser() {
      try {
        const response = await axios.get('/user/');
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    }
    getUser();
};

return (
    <form onSubmit={handleSubmit}>
        <div >
            <label>
                Name:
                <input
                    className='border border-solid border-2 border-black'
                    type="text"
                    name="ClientId"
                    value={formData.ClientId}
                    onChange={handleChange}
                />
            </label>
        </div>
        <button className='border border-solid border-2 border-black' type="Generate OTP">Submit</button>
    </form>
);
};

export default App
