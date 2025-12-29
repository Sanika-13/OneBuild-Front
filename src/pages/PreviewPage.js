import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Portfolio.css';

const PreviewPage = () => {
    const [portfolioData, setPortfolioData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Get preview data from localStorage
        const previewData = localStorage.getItem('previewData');
        if (previewData) {
            setPortfolioData(JSON.parse(previewData));
        } else {
            // If no preview data, redirect back
            alert('No preview data available. Please create a portfolio first.');
            window.close();
        }

        // Listen for updates from parent window
        const handleStorageChange = () => {
            const updatedData = localStorage.getItem('previewData');
            if (updatedData) {
                setPortfolioData(JSON.parse(updatedData));
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Poll for changes every 500ms for real-time updates
        const interval = setInterval(() => {
            const updatedData = localStorage.getItem('previewData');
            if (updatedData) {
                const newData = JSON.parse(updatedData);
                setPortfolioData(prevData => {
                    // Only update if data actually changed
                    if (JSON.stringify(prevData) !== JSON.stringify(newData)) {
                        return newData;
                    }
                    return prevData;
                });
            }
        }, 500);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    if (!portfolioData) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontSize: '1.5rem'
            }}>
                Loading preview...
            </div>
        );
    }

    // Render portfolio using same structure as Portfolio.js
    return (
        <div className={`portfolio-container ${portfolioData.theme || 'dark'}`}>
            <div className="portfolio-banner">
                <div className="banner-overlay">
                    <h1 className="portfolio-title">Welcome to my portfolio!</h1>
                    <p className="portfolio-subtitle">
                        📧 {portfolioData.socialLinks?.email || 'email@example.com'}
                    </p>
                    <p className="portfolio-subtitle">
                        📞 {portfolioData.socialLinks?.countryCode || '+91'}{portfolioData.socialLinks?.phone || '0000000000'}
                    </p>
                </div>
            </div>

            {/* Stats Section */}
            <div className="stats-container">
                <div className="stat-card">
                    <h3>Months of Experience</h3>
                    <p className="stat-number">{portfolioData.stats?.yearsOfExperience || '0'}+</p>
                </div>
                <div className="stat-card">
                    <h3>Internship Completed</h3>
                    <p className="stat-number">{portfolioData.stats?.internshipsCompleted || '0'}+</p>
                </div>
                <div className="stat-card">
                    <h3>Projects Completed</h3>
                    <p className="stat-number">{portfolioData.stats?.projectsCompleted || '0'}+</p>
                </div>
                <div className="stat-card">
                    <h3>No of Skills</h3>
                    <p className="stat-number">{portfolioData.skills?.length || '0'}+</p>
                </div>
            </div>

            {/* About Section */}
            <section className="portfolio-section">
                <h2 className="section-title">About Me</h2>
                <p className="about-text">{portfolioData.about || 'No description provided'}</p>
            </section>

            {/* Skills Section */}
            {portfolioData.skills && portfolioData.skills.length > 0 && (
                <section className="portfolio-section">
                    <h2 className="section-title">🛠️ Skills</h2>
                    <div className="skills-grid">
                        {portfolioData.skills.map((skill, index) => (
                            <div key={index} className="skill-badge">{skill}</div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects Section */}
            {portfolioData.projects && portfolioData.projects.length > 0 && (
                <section className="portfolio-section">
                    <h2 className="section-title">💼 Projects</h2>
                    <div className="projects-grid">
                        {portfolioData.projects.map((project, index) => (
                            <div key={index} className="project-card">
                                <h3>{project.name || 'Untitled Project'}</h3>
                                <p>{project.description || 'No description'}</p>
                                <p className="project-tech"><strong>Tech:</strong> {project.technologies || 'N/A'}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Live Preview Badge */}
            <div style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                background: 'rgba(102, 126, 234, 0.9)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '25px',
                fontSize: '0.9rem',
                fontWeight: '600',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                zIndex: 1000,
                animation: 'pulse 2s infinite'
            }}>
                👁️ Live Preview Mode
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
            `}</style>
        </div>
    );
};

export default PreviewPage;
