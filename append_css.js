const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src/pages/Portfolio.css');
const mobileCss = `

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .portfolio-content { padding: 20px 15px; }
  .portfolio-header { margin-bottom: 40px; padding: 0; }
  .header-content { flex-direction: column; text-align: center; gap: 30px; }
  .profile-image { width: 250px; height: 250px; min-width: 250px; min-height: 250px; border-width: 3px; }
  .intro-text { margin-top: 10px; width: 100%; }
  .greeting { font-size: 2rem; margin-bottom: 15px; }
  .resume-btn, .copy-link-btn { padding: 12px 24px; font-size: 1rem; }
  .social-links { justify-content: center; }
  .section { margin: 40px 0; }
  .section-title { font-size: 1.8rem; text-align: center; display: block; margin-bottom: 25px; }
  .education-card, .project-card, .achievement-card { flex-direction: column; text-align: center; padding: 20px; }
  .edu-right, .project-image { width: 100%; margin-top: 15px; height: auto; }
}
`;

try {
    fs.appendFileSync(cssPath, mobileCss);
    console.log('✅ CSS Appended Successfully to:', cssPath);
} catch (err) {
    console.error('❌ Error appending CSS:', err);
    process.exit(1);
}
