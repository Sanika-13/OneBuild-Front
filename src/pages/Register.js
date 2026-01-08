import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Register = () => {
    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent multiple submissions
        if (loading) return;

        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match!');
            setLoading(false); // Reset loading on error
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false); // Reset loading on error
            return;
        }

        try {
            // Use environment variable or fallback based on hostname
            const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const API_URL = isLocal ? 'http://localhost:5000' : (process.env.REACT_APP_API_URL || 'https://one-build-backend.vercel.app');

            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Clear error and show success popup
                setError('');

                // Store token and user data from registration response
                if (data.token && data.user) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                }

                setShowSuccess(true);
            } else {
                setError(data.error || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration Error:', error);
            if (error.message.includes('Failed to fetch')) {
                setError('Cannot connect to server. Please make sure the backend is running.');
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoToDashboard = () => {
        navigate('/dashboard');
    };

    return (
        <div className="auth-page">
            {/* Success Popup */}
            {showSuccess && (
                <div className="success-overlay">
                    <div className="success-popup">
                        <div className="success-icon">✅</div>
                        <h2>Registration Successful!</h2>
                        <p>Welcome to OneBuild! You can now create your portfolio.</p>
                        <button onClick={handleGoToDashboard} className="success-btn">
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            )}

            <div className="auth-container">
                <div className="auth-header">
                    <h1 className="auth-logo" onClick={() => navigate('/')}>OneBuild</h1>
                    <h2>Create Your Account</h2>
                    <p>Register to start building your portfolio</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && (
                        <div style={{
                            background: '#f8d7da',
                            color: '#721c24',
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '15px',
                            border: '1px solid #f5c6cb',
                            fontSize: '0.9rem'
                        }}>
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            disabled={loading}
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
                            placeholder="Create a password"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            disabled={loading}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <span onClick={() => navigate('/login')} className="auth-link">Login here</span></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
