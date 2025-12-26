import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name, // Using 'name' but backend checks name or email
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store token and user data
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Redirect to dashboard
                navigate('/dashboard');
            } else {
                alert(data.error || 'Invalid credentials');
            }
        } catch (error) {
            console.error('Login Error:', error);
            alert('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <h1 className="auth-logo" onClick={() => navigate('/')}>OneBuild</h1>
                    <h2>Welcome Back!</h2>
                    <p>Login to access your portfolio</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button type="submit" className="auth-btn">Login</button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <span onClick={() => navigate('/register')} className="auth-link">Register here</span></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
