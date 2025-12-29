import React from 'react';
import './StudentDashboard.css';

const LivePreview = ({ formData, profileImagePreview }) => {
    return (
        <div className="live-preview-panel">
            <div className="preview-header">
                <h2>👁️ Live Preview</h2>
                <p>Changes update in real-time</p>
            </div>

            <div className="preview-content">
                <div className="preview-portfolio">
                    {/* Banner */}
                    <div className="preview-banner">
                        {profileImagePreview && (
                            <img
                                src={profileImagePreview}
                                alt="Profile"
                                className="preview-profile-img"
                            />
                        )}
                        <h1>{formData.name || 'Your Name'}</h1>
                        <p>📧 {formData.socialLinks?.email || 'email@example.com'}</p>
                        <p>📞 {formData.socialLinks?.countryCode || '+91'}{formData.socialLinks?.phone || '0000000000'}</p>
                    </div>

                    {/* Stats */}
                    <div className="preview-stats-grid">
                        <div className="preview-stat-card">
                            <h3>Experience</h3>
                            <p>{formData.stats?.yearsOfExperience || '0'}+</p>
                        </div>
                        <div className="preview-stat-card">
                            <h3>Internships</h3>
                            <p>{formData.stats?.internshipsCompleted || '0'}+</p>
                        </div>
                        <div className="preview-stat-card">
                            <h3>Projects</h3>
                            <p>{formData.stats?.projectsCompleted || '0'}+</p>
                        </div>
                        <div className="preview-stat-card">
                            <h3>Skills</h3>
                            <p>{formData.skills?.length || '0'}+</p>
                        </div>
                    </div>

                    {/* About */}
                    {formData.about && (
                        <div className="preview-section">
                            <h2>About Me</h2>
                            <p>{formData.about}</p>
                        </div>
                    )}

                    {/* Skills */}
                    {formData.skills && formData.skills.length > 0 && (
                        <div className="preview-section">
                            <h2>🛠️ Skills</h2>
                            <div className="preview-skills-grid">
                                {formData.skills.map((skill, idx) => (
                                    <span key={idx} className="preview-skill-badge">{skill}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Projects */}
                    {formData.projects && formData.projects.filter(p => p.name).length > 0 && (
                        <div className="preview-section">
                            <h2>💼 Projects</h2>
                            <div className="preview-projects-grid">
                                {formData.projects.filter(p => p.name).map((project, idx) => (
                                    <div key={idx} className="preview-project-card">
                                        <h3>{project.name}</h3>
                                        <p>{project.description}</p>
                                        <p><strong>Tech:</strong> {project.technologies}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LivePreview;
