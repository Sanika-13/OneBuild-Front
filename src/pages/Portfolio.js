import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Portfolio.css";

const Portfolio = () => {
  const { uniqueUrl } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const projectsRef = React.useRef(null);

  const scrollProjects = (direction) => {
    if (projectsRef.current) {
      const { current } = projectsRef;
      const scrollAmount = 400; // Approx card width
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/portfolio/${uniqueUrl}`
        );
        setPortfolio(response.data);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      } finally {
        setLoading(false);
      }
    };

    if (uniqueUrl) {
      fetchPortfolio();
    }
  }, [uniqueUrl]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading portfolio...</p>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="error-container">
        <h2>Portfolio not found</h2>
        <p>The portfolio you're looking for doesn't exist.</p>
      </div>
    );
  }

  const theme = portfolio.theme || "dark";
  const animation = portfolio.animation || "none";

  // Force PURE BLACK text for light themes
  const lightThemeStyle =
    theme === "light" || theme === "minimalist"
      ? { color: "#000000 !important", WebkitTextFillColor: "#000000" }
      : {};

  return (
    <div
      className={`portfolio-container theme-${theme} animation-${animation}`}
    >
      {/* Animated Background Elements */}
      {theme === "animated" && (
        <div className="animated-background">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
      )}

      <div className="portfolio-content" style={lightThemeStyle}>
        {/* Header Section */}
        <header className="portfolio-header">
          <div className="header-content">
            {portfolio.profileImage && (
              <img
                src={portfolio.profileImage.startsWith("http")
                  ? portfolio.profileImage
                  : `${process.env.REACT_APP_API_URL}${portfolio.profileImage}`
                }
                alt={portfolio.name}
                className="profile-image"
              />
            )}
            <div className="intro-text">
              <h1 className="greeting typing-animation">
                Hello everyone, I am{" "}
                <span className="name-highlight">{portfolio.name}</span>
              </h1>
              <p className="welcome-text">Welcome to my portfolio!</p>
              {portfolio.socialLinks?.email && (
                <p className="email-text" style={{
                  fontSize: '0.95rem',
                  marginTop: '10px',
                  opacity: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  animation: 'fadeIn 0.5s ease-in forwards',
                  animationDelay: '5s'
                }}>
                  <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  {portfolio.socialLinks.email}
                </p>
              )}
              {portfolio.resume && (
                <a href={portfolio.resume.startsWith('http') ? portfolio.resume : `${process.env.REACT_APP_API_URL}${portfolio.resume}`} target="_blank" rel="noopener noreferrer" className="resume-btn" style={{
                  marginTop: '15px', display: 'inline-block', padding: '8px 16px', background: '#fff', color: '#000', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold'
                }}>
                  Download Resume 📄
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Stats Section */}
        {portfolio.stats && (
          <section className="section stats-section" style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', padding: '20px 0' }}>
            {portfolio.stats.yearsOfExperience && (
              <div className="stat-card" style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '8px', textAlign: 'center', minWidth: '120px' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{portfolio.stats.yearsOfExperience}</h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Years Exp</p>
              </div>
            )}
            {portfolio.stats.projectsCompleted && (
              <div className="stat-card" style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '8px', textAlign: 'center', minWidth: '120px' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{portfolio.stats.projectsCompleted}</h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Projects</p>
              </div>
            )}
            {portfolio.stats.internshipsCompleted && (
              <div className="stat-card" style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '8px', textAlign: 'center', minWidth: '120px' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{portfolio.stats.internshipsCompleted}</h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Internships</p>
              </div>
            )}
            {portfolio.stats.totalSkills && (
              <div className="stat-card" style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '8px', textAlign: 'center', minWidth: '120px' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{portfolio.stats.totalSkills}</h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Total Skills</p>
              </div>
            )}
          </section>
        )}

        {/* About Section */}
        {portfolio.about && (
          <section className="section about-section">
            <h2 className="section-title">About Me</h2>
            <div className="about-card">
              <p className="about-text">{portfolio.about}</p>
            </div>
          </section>
        )}

        {/* Skills Section */}
        {portfolio.skills && portfolio.skills.length > 0 && (
          <section className="section skills-section">
            <h2 className="section-title">Technical Skills</h2>
            <div className="skills-grid">
              {portfolio.skills.map((skill, index) => (
                <div key={index} className="skill-badge">
                  <span className="skill-name">{skill}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {portfolio.projects &&
          portfolio.projects.length > 0 &&
          portfolio.projects[0].name && (
            <section className="section projects-section">
              <h2 className="section-title">Projects</h2>
              <div className="projects-carousel-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <button
                  className="carousel-btn left-btn"
                  onClick={() => scrollProjects('left')}
                  style={{
                    position: 'absolute',
                    left: '-20px',
                    zIndex: 10,
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    fontSize: '1.5rem',
                    backdropFilter: 'blur(5px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  &#8249;
                </button>

                <div className="projects-grid" ref={projectsRef} style={{
                  display: 'flex',
                  overflowX: 'auto',
                  scrollBehavior: 'smooth',
                  scrollSnapType: 'x mandatory',
                  gap: '30px',
                  padding: '20px 5px',
                  width: '100%',
                  scrollbarWidth: 'none' // Firefox
                }}>
                  {portfolio.projects.map((project, index) => (
                    <div key={index} className="project-card" style={{
                      minWidth: '400px', // Increased width per request
                      flex: '0 0 auto',
                      scrollSnapAlign: 'start'
                    }}>
                      {project.image && (
                        <img src={project.image.startsWith('http') ? project.image : `${process.env.REACT_APP_API_URL}${project.image}`} alt={project.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px 8px 0 0', marginBottom: '10px' }} />
                      )}
                      <h3 className="project-name">{project.name}</h3>
                      <p className="project-description">{project.description}</p>
                      {project.technologies && (
                        <div className="tech-tags">
                          {project.technologies.split(",").map((tech, i) => (
                            <span key={i} className="tech-tag">
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link"
                        >
                          View Project →
                        </a>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  className="carousel-btn right-btn"
                  onClick={() => scrollProjects('right')}
                  style={{
                    position: 'absolute',
                    right: '-20px',
                    zIndex: 10,
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    fontSize: '1.5rem',
                    backdropFilter: 'blur(5px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  &#8250;
                </button>
              </div>
            </section>
          )}

        {/* Experience Section */}
        {portfolio.experience &&
          portfolio.experience.length > 0 &&
          portfolio.experience[0].title && (
            <section className="section experience-section">
              <h2 className="section-title">Experience</h2>
              <div className="experience-grid">
                {portfolio.experience.map((exp, index) => (
                  <div key={index} className="experience-card">
                    <h3 className="job-title">{exp.title}</h3>
                    <p className="company-name">{exp.company}</p>
                    <p className="duration">{exp.duration}</p>
                    <p className="job-description">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

        {/* Achievements Section */}
        {portfolio.achievements &&
          portfolio.achievements.length > 0 &&
          (portfolio.achievements[0].title || typeof portfolio.achievements[0] === 'string') && (
            <section className="section achievements-section">
              <h2 className="section-title">Achievements</h2>
              <div className="achievements-grid">
                {portfolio.achievements.map((achievement, index) => (
                  <div key={index} className="achievement-card">
                    {typeof achievement !== 'string' && achievement.image && (
                      <img src={achievement.image.startsWith('http') ? achievement.image : `${process.env.REACT_APP_API_URL}${achievement.image}`} alt="Achievement" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />
                    )}
                    <span className="achievement-icon">🏆</span>
                    <p className="achievement-text">{typeof achievement === 'string' ? achievement : achievement.title}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

        {/* Connect Section */}
        <section className="section connect-section">
          <h2 className="section-title">Connect With Me :)</h2>
          <div className="social-links">

            {portfolio.socialLinks?.phone && (
              <a
                href={`https://wa.me/${portfolio.socialLinks.countryCode}${portfolio.socialLinks.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link whatsapp"
              >
                <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>WhatsApp</span>
              </a>
            )}
            {portfolio.socialLinks?.github && (
              <a
                href={portfolio.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link github"
              >
                <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span>GitHub</span>
              </a>
            )}
            {portfolio.socialLinks?.linkedin && (
              <a
                href={portfolio.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link linkedin"
              >
                <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span>LinkedIn</span>
              </a>
            )}
            {portfolio.socialLinks?.instagram && (
              <a
                href={portfolio.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link instagram"
              >
                <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span>Instagram</span>
              </a>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="portfolio-footer">
          <p>
            {portfolio.name.replace(/\s+/g, "")}© {new Date().getFullYear()}.
            All rights reserved.
          </p>
          <p className="powered-by">Made by OneBuild :)</p>
        </footer>
      </div>
    </div>
  );
};

export default Portfolio;
