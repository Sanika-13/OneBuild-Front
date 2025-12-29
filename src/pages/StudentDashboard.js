import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';

  useEffect(() => {
    const fetchMyPortfolio = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // ONLY fetch data if we are in Edit Mode (via query param)
      if (!isEditMode) return;

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/portfolio/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data) {
          console.log("✅ Pre-filling form with data:", response.data);
          // Merge existing data, but ensure nested objects/arrays are handled if needed
          // For now, simple spread works because structure matches, but check socialLinks
          const data = response.data;

          setFormData(prev => ({
            ...prev,
            ...data,
            // Ensure defaulting if some fields are missing in old data
            socialLinks: { ...prev.socialLinks, ...data.socialLinks },
            stats: { ...prev.stats, ...data.stats }
          }));

          // Handle Profile Image Preview
          if (data.profileImage) {
            if (data.profileImage.startsWith('http') || data.profileImage.startsWith('data:')) {
              setProfileImagePreview(data.profileImage);
            } else {
              setProfileImagePreview(`${process.env.REACT_APP_API_URL}${data.profileImage}`);
            }
          }
        }
      } catch (error) {
        // 404 is expected for new users, so don't alert error
        if (error.response && error.response.status !== 404) {
          console.error("Error fetching existing portfolio:", error);
        }
      }
    };

    fetchMyPortfolio();
  }, [navigate, isEditMode]); // Added isEditMode to dependencies

  // Clear any stale messages on component mount
  useEffect(() => {
    setMessage('');
    setLoading(false);
  }, []); // Run once on mount

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    about: '',
    profileImage: null,
    skills: [],
    projects: [{ name: '', description: '', technologies: '', link: '' }],
    achievements: [{ title: '', image: '' }],
    experience: [{ title: '', company: '', duration: '', description: '' }],
    socialLinks: {
      email: '',
      phone: '',
      countryCode: '+91',
      github: '',
      linkedin: '',
      instagram: ''
    },
    theme: 'dark',
    resume: null,
    stats: {
      yearsOfExperience: '',
      projectsCompleted: '',
      internshipsCompleted: '',
      totalSkills: ''
    }
  });

  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fileLoading, setFileLoading] = useState(false);
  // const [saveAsNew, setSaveAsNew] = useState(true); // Removed state, will force TRUE in logic
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false); // Live preview toggle

  // Skills options
  // Generic File Upload Handler
  const handleFileUpload = async (file) => {
    const formDataImg = new FormData();
    formDataImg.append('image', file);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/resume/upload-image`, formDataImg, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.path;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    }
  };

  // Handle Resume Upload
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const path = await handleFileUpload(file);
    if (path) {
      setFormData(prev => ({ ...prev, resume: path }));
      setMessage('✅ Resume uploaded successfully!');
    } else {
      setMessage('❌ Resume upload failed');
    }
    setLoading(false);
  };

  // Handle Project Image Upload
  const handleProjectImageUpload = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const path = await handleFileUpload(file);
    if (path) {
      handleProjectChange(index, 'image', path);
      setMessage('✅ Project image uploaded!');
    }
    setLoading(false);
  };

  // Handle Achievement Image Upload
  const handleAchievementImageUpload = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const path = await handleFileUpload(file);
    if (path) {
      const updatedAchievements = [...formData.achievements];
      if (typeof updatedAchievements[index] === 'string') {
        updatedAchievements[index] = { title: updatedAchievements[index], image: path };
      } else {
        updatedAchievements[index].image = path;
      }
      setFormData(prev => ({ ...prev, achievements: updatedAchievements }));
      setMessage('✅ Achievement image uploaded!');
    }
    setLoading(false);
  };

  // Handle Stats Change
  const handleStatsChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      stats: { ...prev.stats, [name]: value }
    }));
  };

  // Handle achievement title change (for object structure)
  const handleAchievementTitleChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.map((ach, i) => {
        if (i !== index) return ach;
        if (typeof ach === 'string') return { title: value, image: '' };
        return { ...ach, title: value };
      })
    }));
  };

  // Skills options (100+ skills)
  const skillsOptions = [
    // Frontend
    'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue.js', 'Svelte', 'Next.js', 'Nuxt.js',
    'jQuery', 'Bootstrap', 'Tailwind CSS', 'Material-UI', 'Ant Design', 'Chakra UI', 'SASS', 'LESS', 'Styled Components',
    'Redux', 'MobX', 'Zustand', 'Recoil', 'Context API', 'Webpack', 'Vite', 'Parcel', 'Rollup',

    // Backend
    'Node.js', 'Express.js', 'Nest.js', 'Fastify', 'Koa', 'Python', 'Django', 'Flask', 'FastAPI',
    'Java', 'Spring Boot', 'PHP', 'Laravel', 'Symfony', 'Ruby', 'Ruby on Rails', 'Go', 'Gin', 'Echo',
    'C#', '.NET', 'ASP.NET', 'Rust', 'Actix', 'Scala', 'Play Framework',

    // Databases
    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'Microsoft SQL Server',
    'MariaDB', 'Cassandra', 'DynamoDB', 'Firebase', 'Supabase', 'Prisma', 'TypeORM', 'Sequelize',
    'Mongoose', 'Elasticsearch', 'Neo4j', 'CouchDB',

    // Mobile
    'React Native', 'Flutter', 'Swift', 'SwiftUI', 'Kotlin', 'Android', 'iOS', 'Xamarin', 'Ionic',

    // DevOps & Cloud
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud', 'Heroku', 'Netlify', 'Vercel',
    'CI/CD', 'Jenkins', 'GitHub Actions', 'GitLab CI', 'CircleCI', 'Travis CI',
    'Terraform', 'Ansible', 'Chef', 'Puppet', 'Nginx', 'Apache',

    // Version Control
    'Git', 'GitHub', 'GitLab', 'Bitbucket', 'SVN',

    // Testing
    'Jest', 'Mocha', 'Chai', 'Jasmine', 'Cypress', 'Selenium', 'Playwright', 'Puppeteer',
    'JUnit', 'PyTest', 'TestNG', 'Postman', 'Insomnia',

    // API & Protocols
    'REST API', 'GraphQL', 'gRPC', 'WebSocket', 'Socket.io', 'SOAP', 'OAuth', 'JWT',

    // Data Science & ML
    'TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn',
    'OpenCV', 'NLTK', 'SpaCy', 'Jupyter', 'R', 'MATLAB',

    // Other
    'Linux', 'Bash', 'PowerShell', 'Agile', 'Scrum', 'Jira', 'Trello', 'Figma', 'Adobe XD',
    'Photoshop', 'Illustrator', 'UI/UX Design', 'Responsive Design', 'Accessibility', 'SEO',
    'Blockchain', 'Solidity', 'Web3.js', 'Ethereum'
  ];

  // Country codes for all countries
  const countryCodes = [
    { code: '+93', country: 'Afghanistan' },
    { code: '+355', country: 'Albania' },
    { code: '+213', country: 'Algeria' },
    { code: '+376', country: 'Andorra' },
    { code: '+244', country: 'Angola' },
    { code: '+54', country: 'Argentina' },
    { code: '+374', country: 'Armenia' },
    { code: '+61', country: 'Australia' },
    { code: '+43', country: 'Austria' },
    { code: '+994', country: 'Azerbaijan' },
    { code: '+973', country: 'Bahrain' },
    { code: '+880', country: 'Bangladesh' },
    { code: '+375', country: 'Belarus' },
    { code: '+32', country: 'Belgium' },
    { code: '+501', country: 'Belize' },
    { code: '+229', country: 'Benin' },
    { code: '+975', country: 'Bhutan' },
    { code: '+591', country: 'Bolivia' },
    { code: '+387', country: 'Bosnia and Herzegovina' },
    { code: '+267', country: 'Botswana' },
    { code: '+55', country: 'Brazil' },
    { code: '+673', country: 'Brunei' },
    { code: '+359', country: 'Bulgaria' },
    { code: '+226', country: 'Burkina Faso' },
    { code: '+257', country: 'Burundi' },
    { code: '+855', country: 'Cambodia' },
    { code: '+237', country: 'Cameroon' },
    { code: '+1', country: 'Canada' },
    { code: '+238', country: 'Cape Verde' },
    { code: '+236', country: 'Central African Republic' },
    { code: '+235', country: 'Chad' },
    { code: '+56', country: 'Chile' },
    { code: '+86', country: 'China' },
    { code: '+57', country: 'Colombia' },
    { code: '+269', country: 'Comoros' },
    { code: '+242', country: 'Congo' },
    { code: '+506', country: 'Costa Rica' },
    { code: '+385', country: 'Croatia' },
    { code: '+53', country: 'Cuba' },
    { code: '+357', country: 'Cyprus' },
    { code: '+420', country: 'Czech Republic' },
    { code: '+45', country: 'Denmark' },
    { code: '+253', country: 'Djibouti' },
    { code: '+593', country: 'Ecuador' },
    { code: '+20', country: 'Egypt' },
    { code: '+503', country: 'El Salvador' },
    { code: '+372', country: 'Estonia' },
    { code: '+251', country: 'Ethiopia' },
    { code: '+679', country: 'Fiji' },
    { code: '+358', country: 'Finland' },
    { code: '+33', country: 'France' },
    { code: '+241', country: 'Gabon' },
    { code: '+220', country: 'Gambia' },
    { code: '+995', country: 'Georgia' },
    { code: '+49', country: 'Germany' },
    { code: '+233', country: 'Ghana' },
    { code: '+30', country: 'Greece' },
    { code: '+502', country: 'Guatemala' },
    { code: '+224', country: 'Guinea' },
    { code: '+592', country: 'Guyana' },
    { code: '+509', country: 'Haiti' },
    { code: '+504', country: 'Honduras' },
    { code: '+852', country: 'Hong Kong' },
    { code: '+36', country: 'Hungary' },
    { code: '+354', country: 'Iceland' },
    { code: '+91', country: 'India' },
    { code: '+62', country: 'Indonesia' },
    { code: '+98', country: 'Iran' },
    { code: '+964', country: 'Iraq' },
    { code: '+353', country: 'Ireland' },
    { code: '+972', country: 'Israel' },
    { code: '+39', country: 'Italy' },
    { code: '+81', country: 'Japan' },
    { code: '+962', country: 'Jordan' },
    { code: '+7', country: 'Kazakhstan' },
    { code: '+254', country: 'Kenya' },
    { code: '+965', country: 'Kuwait' },
    { code: '+996', country: 'Kyrgyzstan' },
    { code: '+856', country: 'Laos' },
    { code: '+371', country: 'Latvia' },
    { code: '+961', country: 'Lebanon' },
    { code: '+266', country: 'Lesotho' },
    { code: '+231', country: 'Liberia' },
    { code: '+218', country: 'Libya' },
    { code: '+423', country: 'Liechtenstein' },
    { code: '+370', country: 'Lithuania' },
    { code: '+352', country: 'Luxembourg' },
    { code: '+853', country: 'Macau' },
    { code: '+389', country: 'Macedonia' },
    { code: '+261', country: 'Madagascar' },
    { code: '+265', country: 'Malawi' },
    { code: '+60', country: 'Malaysia' },
    { code: '+960', country: 'Maldives' },
    { code: '+223', country: 'Mali' },
    { code: '+356', country: 'Malta' },
    { code: '+222', country: 'Mauritania' },
    { code: '+230', country: 'Mauritius' },
    { code: '+52', country: 'Mexico' },
    { code: '+373', country: 'Moldova' },
    { code: '+377', country: 'Monaco' },
    { code: '+976', country: 'Mongolia' },
    { code: '+382', country: 'Montenegro' },
    { code: '+212', country: 'Morocco' },
    { code: '+258', country: 'Mozambique' },
    { code: '+95', country: 'Myanmar' },
    { code: '+264', country: 'Namibia' },
    { code: '+977', country: 'Nepal' },
    { code: '+31', country: 'Netherlands' },
    { code: '+64', country: 'New Zealand' },
    { code: '+505', country: 'Nicaragua' },
    { code: '+227', country: 'Niger' },
    { code: '+234', country: 'Nigeria' },
    { code: '+47', country: 'Norway' },
    { code: '+968', country: 'Oman' },
    { code: '+92', country: 'Pakistan' },
    { code: '+970', country: 'Palestine' },
    { code: '+507', country: 'Panama' },
    { code: '+675', country: 'Papua New Guinea' },
    { code: '+595', country: 'Paraguay' },
    { code: '+51', country: 'Peru' },
    { code: '+63', country: 'Philippines' },
    { code: '+48', country: 'Poland' },
    { code: '+351', country: 'Portugal' },
    { code: '+974', country: 'Qatar' },
    { code: '+40', country: 'Romania' },
    { code: '+7', country: 'Russia' },
    { code: '+250', country: 'Rwanda' },
    { code: '+966', country: 'Saudi Arabia' },
    { code: '+221', country: 'Senegal' },
    { code: '+381', country: 'Serbia' },
    { code: '+65', country: 'Singapore' },
    { code: '+421', country: 'Slovakia' },
    { code: '+386', country: 'Slovenia' },
    { code: '+252', country: 'Somalia' },
    { code: '+27', country: 'South Africa' },
    { code: '+82', country: 'South Korea' },
    { code: '+211', country: 'South Sudan' },
    { code: '+34', country: 'Spain' },
    { code: '+94', country: 'Sri Lanka' },
    { code: '+249', country: 'Sudan' },
    { code: '+597', country: 'Suriname' },
    { code: '+268', country: 'Swaziland' },
    { code: '+46', country: 'Sweden' },
    { code: '+41', country: 'Switzerland' },
    { code: '+963', country: 'Syria' },
    { code: '+886', country: 'Taiwan' },
    { code: '+992', country: 'Tajikistan' },
    { code: '+255', country: 'Tanzania' },
    { code: '+66', country: 'Thailand' },
    { code: '+228', country: 'Togo' },
    { code: '+216', country: 'Tunisia' },
    { code: '+90', country: 'Turkey' },
    { code: '+993', country: 'Turkmenistan' },
    { code: '+256', country: 'Uganda' },
    { code: '+380', country: 'Ukraine' },
    { code: '+971', country: 'United Arab Emirates' },
    { code: '+44', country: 'United Kingdom' },
    { code: '+1', country: 'United States' },
    { code: '+598', country: 'Uruguay' },
    { code: '+998', country: 'Uzbekistan' },
    { code: '+58', country: 'Venezuela' },
    { code: '+84', country: 'Vietnam' },
    { code: '+967', country: 'Yemen' },
    { code: '+260', country: 'Zambia' },
    { code: '+263', country: 'Zimbabwe' }
  ];

  // Theme options
  const themeOptions = [
    { value: 'dark', label: 'Dark' },
    { value: 'light', label: 'Light' },
    { value: 'minimalist', label: 'Minimalist' },
    { value: 'gradient', label: 'Gradient' },
    { value: 'neon', label: 'Neon' },
    { value: 'ocean', label: 'Ocean' },
    { value: 'sunset', label: 'Sunset' },
    { value: 'forest', label: 'Forest' },
    { value: 'cyberpunk', label: 'Cyberpunk' },
    { value: 'pastel', label: 'Pastel' }
  ];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formDataImg = new FormData();
    formDataImg.append('image', file);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/resume/upload-image`, formDataImg, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setFormData(prev => ({ ...prev, profileImage: response.data.path }));
      setProfileImagePreview(URL.createObjectURL(file));
      setMessage('✅ Image uploaded successfully!');
    } catch (error) {
      setMessage('❌ Error uploading image');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle skills change
  const handleSkillsChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setFormData(prev => ({ ...prev, skills: selected }));
  };

  // Add more project
  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, { name: '', description: '', technologies: '', link: '' }]
    }));
  };

  // Remove project
  const removeProject = (index) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  // Handle project change
  const handleProjectChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) =>
        i === index ? { ...proj, [field]: value } : proj
      )
    }));
  };

  // Add more achievement
  const addAchievement = () => {
    setFormData(prev => ({
      ...prev,
      achievements: [...prev.achievements, { title: '', image: '' }]
    }));
  };

  // Remove achievement
  const removeAchievement = (index) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  // Handle achievement change
  const handleAchievementChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.map((ach, i) =>
        i === index ? value : ach
      )
    }));
  };

  // Add more experience
  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, { title: '', company: '', duration: '', description: '' }]
    }));
  };

  // Remove experience
  const removeExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  // Handle experience change
  const handleExperienceChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  // Handle social links change
  const handleSocialLinkChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [field]: value }
    }));
  };


  // Create portfolio
  const handleCreatePortfolio = async () => {
    setLoading(true);
    setMessage(''); // Clear previous messages

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setMessage('❌ Please login first');
        navigate('/login');
        return;
      }

      // Validate required fields
      if (!formData.name || !formData.about) {
        setMessage('❌ Please fill in all required fields (Name and About)');
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/portfolio/create`,
        {
          ...formData,
          isNewVersion: true // ALWAYS force new version (unique link)
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 30000 // 30 second timeout
        }
      );

      const portfolioUrl = `${process.env.REACT_APP_FRONTEND_URL}/p/${response.data.portfolio.uniqueUrl}`;

      setMessage(
        <div style={{
          background: 'linear-gradient(135deg, #d4edda 0%, #f1f9f4 100%)',
          padding: '25px',
          borderRadius: '12px',
          border: '2px solid #28a745',
          marginBottom: '20px',
          boxShadow: '0 4px 12px rgba(40, 167, 69, 0.2)',
          maxWidth: '700px',
          margin: '0 auto 20px auto'
        }}>
          <p style={{
            fontSize: '1.3rem',
            fontWeight: '700',
            color: '#155724',
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            ✅ Portfolio Created! (Unique Link Generated) 🎉
          </p>
          <p style={{
            fontSize: '1.1rem',
            color: '#155724',
            textAlign: 'center',
            marginBottom: '10px'
          }}>
            <strong>Portfolio Link:</strong>
          </p>
          <p style={{ textAlign: 'center' }}>
            <a
              href={portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#667eea',
                textDecoration: 'underline',
                fontSize: '1.05rem',
                fontWeight: '600',
                wordBreak: 'break-all'
              }}
            >
              {portfolioUrl}
            </a>
          </p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(portfolioUrl);
              alert('Link copied to clipboard! 📋');
            }}
            style={{
              marginTop: '15px',
              padding: '8px 16px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              display: 'block',
              margin: '15px auto 0'
            }}
          >
            📋 Copy Link
          </button>
        </div>
      );
    } catch (error) {
      console.error('Portfolio Create Error Details:', error);

      // Detailed error message extraction
      let detailedMsg = '❌ Error creating portfolio';

      if (error.code === 'ECONNABORTED') {
        detailedMsg = '❌ Request timeout - Server is taking too long. Please try again.';
      } else if (error.code === 'ERR_NETWORK') {
        detailedMsg = '❌ Network error - Please check your internet connection and make sure the backend server is running.';
      } else if (error.response) {
        // Server responded with error
        if (error.response.status === 401) {
          detailedMsg = '❌ Session expired - Please login again';
          setTimeout(() => navigate('/login'), 2000);
        } else if (error.response.status === 400) {
          detailedMsg = `❌ ${error.response.data?.message || error.response.data?.error || 'Invalid data provided'}`;
        } else if (error.response.status === 500) {
          detailedMsg = '❌ Server error - Please try again later';
        } else if (error.response.data?.message) {
          detailedMsg = `❌ ${error.response.data.message}`;
        } else if (error.response.data?.error) {
          detailedMsg = `❌ ${error.response.data.error}`;
        }
      } else if (error.request) {
        // Request made but no response
        detailedMsg = '❌ Cannot reach server - Please make sure the backend is running on ' + process.env.REACT_APP_API_URL;
      } else if (error.message) {
        detailedMsg = `❌ ${error.message}`;
      }

      setMessage(detailedMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Clear any cached form data (optional but safer)
    localStorage.clear();

    // Navigate to login
    navigate('/login');
  };

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <h1>Create Your Portfolio</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>



      <div className="form-container">
        {/* Name */}
        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your name"
            required
          />
        </div>

        {/* About */}
        <div className="form-group">
          <label>About *</label>
          <textarea
            name="about"
            value={formData.about}
            onChange={handleInputChange}
            placeholder="Tell us about yourself..."
            rows="4"
            required
          />
        </div>

        {/* Profile Image & Resume */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label>Profile Image *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              required
            />
            {profileImagePreview && (
              <img src={profileImagePreview} alt="Preview" className="image-preview" />
            )}
          </div>

          <div className="form-group">
            <label>Resume (PDF/Doc) *</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeUpload}
            />
            {formData.resume && (
              <div style={{ marginTop: '10px', color: '#28a745', fontWeight: 'bold' }}>
                ✅ Resume Uploaded
              </div>
            )}
          </div>
        </div>


        {/* Skills */}
        <div className="form-group">
          <label>Skills *</label>
          <div className="skills-dropdown-wrapper">
            <div
              className="skills-dropdown-trigger"
              onClick={() => setShowSkillsDropdown(!showSkillsDropdown)}
            >
              <div className="selected-skills-display">
                {formData.skills.length > 0 ? (
                  <div className="selected-skills-tags">
                    {formData.skills.map((skill, index) => (
                      <span key={index} className="selected-skill-tag">
                        {skill}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData(prev => ({
                              ...prev,
                              skills: prev.skills.filter(s => s !== skill)
                            }));
                          }}
                          className="remove-skill-btn"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="placeholder-text">Click to select skills...</span>
                )}
              </div>
              <span className="dropdown-arrow">{showSkillsDropdown ? '▲' : '▼'}</span>
            </div>

            {showSkillsDropdown && (
              <div className="skills-dropdown-menu">
                {skillsOptions.map(skill => (
                  <label key={skill} className="skill-dropdown-item">
                    <input
                      type="checkbox"
                      value={skill}
                      checked={formData.skills.includes(skill)}
                      onChange={(e) => {
                        const skill = e.target.value;
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            skills: [...prev.skills, skill]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            skills: prev.skills.filter(s => s !== skill)
                          }));
                        }
                      }}
                    />
                    <span>{skill}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          <small>{formData.skills.length} skill(s) selected</small>
        </div>

        {/* Projects */}
        <div className="form-section">
          <h3>Projects</h3>
          {formData.projects.map((project, index) => (
            <div key={index} className="dynamic-item">
              <input
                type="text"
                placeholder="Project Name"
                value={project.name}
                onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
              />
              <textarea
                placeholder="Description"
                value={project.description}
                onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                rows="3"
              />
              <input
                type="text"
                placeholder="Technologies (comma separated)"
                value={project.technologies}
                onChange={(e) => handleProjectChange(index, 'technologies', e.target.value)}
              />
              <input
                type="url"
                placeholder="Project Link (optional)"
                value={project.link}
                onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
              />
              <div className="upload-btn-wrapper">
                <label>Project Image:</label>
                <input type="file" accept="image/*" onChange={(e) => handleProjectImageUpload(index, e)} />
                {project.image && <small>✅ Image Uploaded</small>}
              </div>
              {index > 0 && (
                <button type="button" onClick={() => removeProject(index)} className="remove-btn">
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addProject} className="add-btn">
            + Add More Project
          </button>
        </div>

        {/* Achievements */}
        <div className="form-section">
          <h3>Achievements (Optional)</h3>
          {formData.achievements.map((achievement, index) => (
            <div key={index} className="dynamic-item">
              <input
                type="text"
                placeholder="Achievement Title"
                value={typeof achievement === 'string' ? achievement : achievement.title}
                onChange={(e) => handleAchievementTitleChange(index, e.target.value)}
              />
              <div className="upload-btn-wrapper">
                <input type="file" accept="image/*" onChange={(e) => handleAchievementImageUpload(index, e)} />
                {(typeof achievement !== 'string' && achievement.image) && <small>✅ Image Uploaded</small>}
              </div>
              {index > 0 && (
                <button type="button" onClick={() => removeAchievement(index)} className="remove-btn">
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addAchievement} className="add-btn">
            + Add More Achievement
          </button>
        </div>

        {/* Experience */}
        <div className="form-section">
          <h3>Experience</h3>
          {formData.experience.map((exp, index) => (
            <div key={index} className="dynamic-item">
              <input
                type="text"
                placeholder="Job Title/Role"
                value={exp.title}
                onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
              />
              <input
                type="text"
                placeholder="Company Name"
                value={exp.company}
                onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
              />
              <input
                type="text"
                placeholder="Duration (e.g., Jan 2023 - Dec 2023)"
                value={exp.duration}
                onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
              />
              <textarea
                placeholder="Description"
                value={exp.description}
                onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                rows="3"
              />
              {index > 0 && (
                <button type="button" onClick={() => removeExperience(index)} className="remove-btn">
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addExperience} className="add-btn">
            + Add More Experience
          </button>
        </div>

        {/* Portfolio Stats */}
        <div className="form-section">
          <h3>Portfolio Statistics</h3>
          <div className="form-group-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label>Years of Experience</label>
              <input
                type="text"
                name="yearsOfExperience"
                value={formData.stats.yearsOfExperience}
                onChange={handleStatsChange}
                placeholder="e.g. 2+"
                required
              />
            </div>
            <div className="form-group">
              <label>Internships Completed</label>
              <input
                type="text"
                name="internshipsCompleted"
                value={formData.stats.internshipsCompleted}
                onChange={handleStatsChange}
                placeholder="e.g. 5+"
                required
              />
            </div>
            <div className="form-group">
              <label>Projects Completed</label>
              <input
                type="text"
                name="projectsCompleted"
                value={formData.stats.projectsCompleted}
                onChange={handleStatsChange}
                placeholder="e.g. 10+"
                required
              />
            </div>
            <div className="form-group">
              <label>Total Skills</label>
              <input
                type="text"
                name="totalSkills"
                value={formData.stats.totalSkills}
                onChange={handleStatsChange}
                placeholder="e.g. 20+"
                required
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="form-section">
          <h3>Connect With Me</h3>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="your.email@example.com"
              value={formData.socialLinks.email}
              onChange={(e) => handleSocialLinkChange('email', e.target.value)}
            />
          </div>
          <div className="form-group phone-group">
            <label>Phone Number</label>
            <div className="phone-input">
              <select
                value={formData.socialLinks.countryCode}
                onChange={(e) => handleSocialLinkChange('countryCode', e.target.value)}
                className="country-code-select"
              >
                {countryCodes.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.country} ({country.code})
                  </option>
                ))}
              </select>
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.socialLinks.phone}
                onChange={(e) => handleSocialLinkChange('phone', e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label>GitHub</label>
            <input
              type="url"
              placeholder="https://github.com/username"
              value={formData.socialLinks.github}
              onChange={(e) => handleSocialLinkChange('github', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>LinkedIn</label>
            <input
              type="url"
              placeholder="https://linkedin.com/in/username"
              value={formData.socialLinks.linkedin}
              onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Instagram</label>
            <input
              type="url"
              placeholder="https://instagram.com/username"
              value={formData.socialLinks.instagram}
              onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
            />
          </div>
        </div>

        {/* Theme Selection */}
        <div className="form-group">
          <label>Choose Theme *</label>
          <select
            name="theme"
            value={formData.theme}
            onChange={handleInputChange}
          >
            {themeOptions.map(theme => (
              <option key={theme.value} value={theme.value}>{theme.label}</option>
            ))}
          </select>
        </div>




        {/* Success Message */}
        {message && <div className="message">{message}</div>}

        {/* Action Buttons */}
        <div className="form-actions">
          <button onClick={() => handleCreatePortfolio(true)} className="create-btn" disabled={loading || !formData.name}>
            {loading ? 'Creating...' : 'Create Portfolio'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
