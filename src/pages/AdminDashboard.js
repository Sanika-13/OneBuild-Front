import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');
  const [users, setUsers] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const getToken = () => localStorage.getItem('token');

  const loadAnalytics = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/analytics`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setUsers(response.data);
    } catch (error) {
      setMessage('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const loadPortfolios = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/portfolios`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setPortfolios(response.data);
    } catch (error) {
      setMessage('Error loading portfolios');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setMessage('User deleted successfully');
      loadUsers();
      loadAnalytics();
    } catch (error) {
      setMessage('Error deleting user');
    }
  };

  const deletePortfolio = async (portfolioId) => {
    if (!window.confirm('Are you sure you want to delete this portfolio?')) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/portfolios/${portfolioId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setMessage('Portfolio deleted successfully');
      loadPortfolios();
      loadAnalytics();
    } catch (error) {
      setMessage('Error deleting portfolio');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMessage('');
    if (tab === 'users') loadUsers();
    if (tab === 'portfolios') loadPortfolios();
    if (tab === 'analytics') loadAnalytics();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => handleTabChange('analytics')}
        >
          📊 Analytics
        </button>
        <button
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => handleTabChange('users')}
        >
          👥 Manage Users
        </button>
        <button
          className={`tab ${activeTab === 'portfolios' ? 'active' : ''}`}
          onClick={() => handleTabChange('portfolios')}
        >
          📁 Manage Portfolios
        </button>
        <button
          className={`tab ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => handleTabChange('templates')}
        >
          🎨 Manage Templates
        </button>
        <button
          className={`tab ${activeTab === 'database' ? 'active' : ''}`}
          onClick={() => handleTabChange('database')}
        >
          💾 Database Management
        </button>
      </div>

      {message && (
        <div className={`admin-message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="admin-content">
        {/* Analytics Tab */}
        {activeTab === 'analytics' && analytics && (
          <div className="analytics-section">
            <h3>System Analytics</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-value">{analytics.totalUsers}</div>
                <div className="stat-label">Total Students</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📁</div>
                <div className="stat-value">{analytics.totalPortfolios}</div>
                <div className="stat-label">Total Portfolios Built</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-value">{analytics.publishedPortfolios}</div>
                <div className="stat-label">Published Portfolios</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏳</div>
                <div className="stat-value">{analytics.unpublishedPortfolios}</div>
                <div className="stat-label">Unpublished Portfolios</div>
              </div>
            </div>

            <div className="theme-distribution">
              <h4>Theme Distribution</h4>
              <div className="theme-stats">
                {analytics.themeDistribution.map(theme => (
                  <div key={theme._id} className="theme-stat">
                    <span className="theme-name">{theme._id}</span>
                    <span className="theme-count">{theme.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="recent-portfolios">
              <h4>Recent Portfolios</h4>
              <div className="portfolio-list">
                {analytics.recentPortfolios.map(portfolio => (
                  <div key={portfolio._id} className="portfolio-item">
                    <span>{portfolio.userId?.name || 'Unknown'}</span>
                    <span className="portfolio-theme">{portfolio.theme}</span>
                    <span className="portfolio-date">
                      {new Date(portfolio.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Manage Users Tab */}
        {activeTab === 'users' && (
          <div className="users-section">
            <h3>Manage Users</h3>
            <p className="section-description">View all registered students and delete fake or inappropriate accounts</p>
            {loading ? (
              <p>Loading users...</p>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Registered On</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() => deleteUser(user._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && <p className="no-data">No users found</p>}
              </div>
            )}
          </div>
        )}

        {/* Manage Portfolios Tab */}
        {activeTab === 'portfolios' && (
          <div className="portfolios-section">
            <h3>Manage Portfolios</h3>
            {loading ? (
              <p>Loading portfolios...</p>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Theme</th>
                      <th>Status</th>
                      <th>Created On</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolios.map(portfolio => (
                      <tr key={portfolio._id}>
                        <td>{portfolio.userId?.name || 'Unknown'}</td>
                        <td><span className="theme-badge">{portfolio.theme}</span></td>
                        <td>
                          <span className={`status-badge ${portfolio.isPublished ? 'published' : 'draft'}`}>
                            {portfolio.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td>{new Date(portfolio.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() => deletePortfolio(portfolio._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {portfolios.length === 0 && <p className="no-data">No portfolios found</p>}
              </div>
            )}
          </div>
        )}

        {/* Manage Templates Tab */}
        {activeTab === 'templates' && (
          <div className="templates-section">
            <h3>Manage Templates</h3>
            <p className="section-description">Add or update portfolio themes and make them live for students</p>

            <div className="current-templates">
              <h4>Current Live Templates</h4>
              <div className="template-grid">
                <div className="template-card live">
                  <div className="template-preview dark-preview"></div>
                  <h5>Dark Theme</h5>
                  <span className="status-badge live">Live</span>
                </div>
                <div className="template-card live">
                  <div className="template-preview minimalist-preview"></div>
                  <h5>Minimalist Theme</h5>
                  <span className="status-badge live">Live</span>
                </div>
                <div className="template-card live">
                  <div className="template-preview modern-preview"></div>
                  <h5>Modern/Creative Theme</h5>
                  <span className="status-badge live">Live</span>
                </div>
              </div>
            </div>

            <div className="add-template">
              <h4>Add New Template</h4>
              <p className="info-text">Feature coming soon: Upload custom templates for students to use</p>
            </div>
          </div>
        )}

        {/* Database Management Tab */}
        {activeTab === 'database' && (
          <div className="database-section">
            <h3>Database Management</h3>
            <p className="section-description">Backup data and maintain system stability</p>

            <div className="db-actions">
              <div className="db-card">
                <h4>💾 Backup Database</h4>
                <p>Create a backup of all user data and portfolios</p>
                <button className="action-btn backup">Create Backup</button>
              </div>

              <div className="db-card">
                <h4>🧹 Clean Unused Data</h4>
                <p>Remove unpublished portfolios older than 30 days</p>
                <button className="action-btn clean">Clean Database</button>
              </div>

              <div className="db-card">
                <h4>📊 Database Stats</h4>
                <p>Total Records: {analytics?.totalUsers + analytics?.totalPortfolios || 0}</p>
                <p>Storage Used: Calculating...</p>
              </div>

              <div className="db-card">
                <h4>🔄 System Health</h4>
                <p>Server Status: <span className="status-ok">Healthy</span></p>
                <p>Last Backup: Never</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
