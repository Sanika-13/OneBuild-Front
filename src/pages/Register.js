import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Register = () => {
    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false);
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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        // TODO: Add registration logic here
        console.log('Register:', formData);

        // Show success popup
        setShowSuccess(true);
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
                    <div className="form-group">
                        <label>Full Name</label>
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
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
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
                            required
                        />
                    </div>

                    <button type="submit" className="auth-btn">Register</button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <span onClick={() => navigate('/login')} className="auth-link">Login here</span></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
