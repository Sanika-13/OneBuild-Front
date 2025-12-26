import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import { FaPhoneAlt, FaEnvelope, FaLaptopCode } from 'react-icons/fa';
import SplashCursor from '../components/SplashCursor.js';

const titles = [
    "Build Your Portfolio in One Place",
    "No Need Of Coding",
    "Build within 2 Minutes",
    "Now, No Need of Multiple Drag & Drop",
    "Simple and User Friendly",
    "No need of Designing"
];

const LandingPage = () => {
    const navigate = useNavigate();
    const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallButton, setShowInstallButton] = useState(false);

    // PWA Install Handler
    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallButton(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            alert('App is already installed or installation is not available on this device.');
            return;
        }

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        }

        setDeferredPrompt(null);
        setShowInstallButton(false);
    };

    useEffect(() => {
        const currentFullTitle = titles[currentTitleIndex];
        const words = currentFullTitle.split(' ');

        let timeout;

        if (!isDeleting) {
            // Adding words
            const currentWordsCount = displayedText ? displayedText.split(' ').length : 0;
            if (currentWordsCount < words.length) {
                // If text is empty (start), delay is small.
                // If just added a word, wait normal time.
                timeout = setTimeout(() => {
                    setDisplayedText(words.slice(0, currentWordsCount + 1).join(' '));
                }, 300);
            } else {
                // Determine pause time based on which title it is (optional) or fixed
                // Wait 2 seconds before ensuring deletion starts
                timeout = setTimeout(() => {
                    setIsDeleting(true);
                }, 2000);
            }
        } else {
            // Deleting words
            const currentWordsCount = displayedText ? displayedText.split(' ').length : 0;
            if (currentWordsCount > 0) {
                timeout = setTimeout(() => {
                    setDisplayedText(words.slice(0, currentWordsCount - 1).join(' '));
                }, 100); // Faster deletion
            } else {
                setIsDeleting(false);
                setCurrentTitleIndex((prev) => (prev + 1) % titles.length);
            }
        }

        return () => clearTimeout(timeout);
    }, [displayedText, isDeleting, currentTitleIndex]);

    return (
        <div className="landing-page">
            <SplashCursor />
            {/* Navbar */}
            <nav className="navbar">
                <div className="nav-container">
                    <div className="nav-logo">
                        <FaLaptopCode className="logo-icon" />
                        <h1>OneBuild</h1>
                    </div>
                    <div className="nav-links">
                        <a href="/">Home</a>
                        <a href="#about">About</a>
                        <a href="#how-it-works">How it Works</a>
                        <a href="#features">Features</a>
                        <a href="#contact">Contact Us</a>
                        <button onClick={() => navigate('/login')} className="nav-btn login-btn">Login</button>
                        <button onClick={() => navigate('/register')} className="nav-btn register-btn">Register</button>
                        <button onClick={handleInstallClick} className="nav-btn download-btn">
                            Download App
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        <span className="animated-title">{displayedText || '\u00A0'}</span>
                    </h1>
                    <p className="hero-subtitle">
                        Create stunning professional portfolios in minutes. No coding required.
                    </p>
                    <p className="hero-trusted-text">
                        Perfect for Students • Developers • Creative Professionals
                    </p>
                    <button onClick={() => navigate('/register')} className="cta-btn">
                        Get Started Free
                    </button>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="about-section">
                <div className="section-container">
                    <h2 className="section-title">About Us</h2>
                    <div className="about-card">
                        <p className="section-text">
                            OneBuild is a powerful portfolio builder that helps students, professionals, and creatives
                            showcase their work beautifully. With our intuitive form-based system, you can create a
                            stunning portfolio in minutes without any coding knowledge. Whether you are looking to land
                            your dream job or share your creative journey, OneBuild provides the perfect canvas.
                            Customize your coverage with unique themes and animations that truly reflect your personal brand.
                        </p>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="how-it-works-section">
                <div className="section-container">
                    <h2 className="section-title">How it Works</h2>
                    <div className="steps-grid">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <div className="step-icon">📝</div>
                            <h3>Enter Details</h3>
                            <p>Fill your skills and projects, experience in our simple form.</p>
                        </div>
                        <div className="step-arrow">➜</div>
                        <div className="step-card">
                            <div className="step-number">2</div>
                            <div className="step-icon">🎨</div>
                            <h3>Pick a Theme</h3>
                            <p>Choose from our professional templates that fit your style.</p>
                        </div>
                        <div className="step-arrow">➜</div>
                        <div className="step-card">
                            <div className="step-number">3</div>
                            <div className="step-icon">🚀</div>
                            <h3>Publish</h3>
                            <p>Get your unique link instantly and share it with the world.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features-section">
                <div className="section-container">
                    <h2 className="section-title">Features</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🎨</div>
                            <h3>Multiple Themes</h3>
                            <p>Choose the multiple themes to match your styles</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">⚡</div>
                            <h3>Quick Setup</h3>
                            <p>Create your portfolio in minutes with our simple form</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🔗</div>
                            <h3>Unique URL</h3>
                            <p>Get a personalized link to share your portfolio</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📱</div>
                            <h3>Responsive Design</h3>
                            <p>Looks perfect on all devices - mobile, tablet, desktop</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🎯</div>
                            <h3>No Coding</h3>
                            <p>Build professional portfolios without writing code</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">✨</div>
                            <h3>Modern UI</h3>
                            <p>Beautiful animations and smooth transitions</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}


            <footer id="contact" className="landing-footer">
                <p style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaPhoneAlt /> +91-7977696118
                    </span>
                    <span>|</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaEnvelope /> 13sanikapatil@gmail.com
                    </span>
                </p>
                <p>SanikaPatil© {new Date().getFullYear()}. All rights reserved.</p>
                <p>Made by SanikaPatil :)</p>
            </footer>
        </div>
    );
};

export default LandingPage;
