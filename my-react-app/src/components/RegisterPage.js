import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Send the email as both username and email to the backend
            const payload = {
                username: formData.email, // Backend will use this as username
                email: formData.email,    // Backend will use this as email
                password: formData.password,
            };

            const response = await axios.post('http://localhost:8000/register/', payload);

            setLoading(false);
            setMessage('Registration successful!');
            localStorage.setItem('token', response.data.access_token); // Store token, if applicable
            setTimeout(() => {
                navigate('/'); // Redirect to homepage after success
            }, 500); // Optional delay to display success message
        } catch (error) {
            setLoading(false);
            setMessage(error.response?.data?.error || 'Registration failed. Please try again.');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
            {message && <p>{message}</p>} {/* Display success or error message */}
        </div>
    );
};

export default RegisterPage;