import React, { useState, useEffect } from 'react';
import axios from 'axios';
import protobufService from './utils/protobuf.js';
import cryptoService from './utils/crypto.js';
import ChartDashboard from './components/ChartDashboard.jsx';

function App() {
  // State management
  const [users, setUsers] = useState([]);
  const [protobufUsers, setProtobufUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [protobufLoading, setProtobufLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('json'); // 'json', 'protobuf', or 'charts'
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Form state for creating/editing users
  const [formData, setFormData] = useState({
    email: '',
    role: 'user',
    status: 'active'
  });
  const [editingUser, setEditingUser] = useState(null);

  // Fetch users from backend with signature verification
  const fetchUsers = async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await axios.get(`/api/users?page=${page}&limit=25`);
      const responseData = response.data;

      // Verify signatures for each user
      const verifiedUsers = await Promise.all(
        responseData.users.map(async (user) => {
          try {
            if (user.emailHash && user.signature) {
              const isValid = await cryptoService.verifySignature(user.email, user.signature);
              return { ...user, signatureValid: isValid };
            }
            return { ...user, signatureValid: false };
          } catch (error) {
            console.error(`Signature verification failed for user ${user.id}:`, error);
            return { ...user, signatureValid: false };
          }
        })
      );

      // Update users list (append for load more, replace for initial load)
      if (append) {
        setUsers(prevUsers => [...prevUsers, ...verifiedUsers]);
      } else {
        setUsers(verifiedUsers);
      }

      // Update pagination state
      setPagination(responseData.pagination);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users: ' + (err.response?.data?.error || err.message));

      // Auto-dismiss error message after 5 seconds
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Fetch users from backend (Protocol Buffers)
  const fetchUsersAsProtobuf = async () => {
    try {
      setProtobufLoading(true);
      const users = await protobufService.fetchUsersAsProtobuf();
      setProtobufUsers(users);
      setError(null);
      setSuccess('✅ Protobuf data loaded successfully!');
      
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError('Failed to fetch protobuf data: ' + err.message);
      
      // Auto-dismiss error message after 5 seconds
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setProtobufLoading(false);
    }
  };

  // Load users when component mounts
  // Load more users
  const loadMoreUsers = () => {
    if (pagination.hasNextPage && !loadingMore) {
      fetchUsers(pagination.currentPage + 1, true);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Create new user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Update existing user
        await axios.put(`/api/users/${editingUser.id}`, formData);
        setSuccess('User updated successfully!');
      } else {
        // Create new user
        await axios.post('/api/users', formData);
        setSuccess('User created successfully!');
      }
      
      // Reset form and refresh users
      setFormData({ email: '', role: 'user', status: 'active' });
      setEditingUser(null);
      fetchUsers();
      
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError('Failed to save user: ' + (err.response?.data?.error || err.message));
      
      // Auto-dismiss error message after 5 seconds
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  // Edit user
  const handleEdit = (user) => {
    setFormData({
      email: user.email,
      role: user.role,
      status: user.status
    });
    setEditingUser(user);
  };

  // Delete user
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/users/${id}`);
        setSuccess('User deleted successfully!');
        fetchUsers();
        
        // Auto-dismiss success message after 3 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } catch (err) {
        setError('Failed to delete user: ' + (err.response?.data?.error || err.message));
        
        // Auto-dismiss error message after 5 seconds
        setTimeout(() => {
          setError(null);
        }, 5000);
      }
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData({ email: '', role: 'user', status: 'active' });
    setEditingUser(null);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Admin Panel</h1>
        <p>Users Management with Protocol Buffers Support</p>
        
        {/* Data Source Tabs */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'json' ? 'active' : ''}`}
            onClick={() => setActiveTab('json')}
          >
            JSON API
          </button>
          <button 
            className={`tab ${activeTab === 'protobuf' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('protobuf');
              fetchUsersAsProtobuf();
            }}
          >
            Protocol Buffers
          </button>
          <button 
            className={`tab ${activeTab === 'charts' ? 'active' : ''}`}
            onClick={() => setActiveTab('charts')}
          >
            📊 Charts
          </button>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {/* User Form - Only show for JSON and Protobuf tabs */}
      {(activeTab === 'json' || activeTab === 'protobuf') && (
        <div className="card">
        <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="user@example.com"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="status">Status:</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <button type="submit" className="btn btn-success">
            {editingUser ? 'Update User' : 'Create User'}
          </button>
          
          {editingUser && (
            <button type="button" className="btn" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </form>
        </div>
      )}

      {/* Users Table - Only show for JSON and Protobuf tabs */}
      {(activeTab === 'json' || activeTab === 'protobuf') && (
        <div className="card">
        <h2>Users List ({activeTab === 'json' ? 'JSON API' : 'Protocol Buffers'})</h2>
        {activeTab === 'json' ? (
          loading ? (
            <div className="loading">Loading users...</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Signature</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.id}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-${user.role}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span className={`status-${user.status}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      {user.signatureValid !== undefined ? (
                        <span className={`signature-${user.signatureValid ? 'valid' : 'invalid'}`}>
                          {user.signatureValid ? '✅ Valid' : '❌ Invalid'}
                        </span>
                      ) : (
                        <span className="signature-unknown">❓ Unknown</span>
                      )}
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className="btn" 
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-danger" 
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : (
          protobufLoading ? (
            <div className="loading">Loading protobuf data...</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {protobufUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.id}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-${user.role}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span className={`status-${user.status}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className="protobuf-badge">Protocol Buffers</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
        
                {activeTab === 'json' && !loading && users.length === 0 && (
                  <div className="loading">No users found. Create your first user above!</div>
                )}

                {/* Load More Button */}
                {activeTab === 'json' && !loading && pagination.hasNextPage && (
                  <div className="load-more-container">
                    <button 
                      className="btn load-more-btn" 
                      onClick={loadMoreUsers}
                      disabled={loadingMore}
                    >
                      {loadingMore ? 'Loading...' : `Load More (${pagination.totalUsers - users.length} remaining)`}
                    </button>
                    <div className="pagination-info">
                      Showing {users.length} of {pagination.totalUsers} users
                    </div>
                  </div>
                )}
        
        {activeTab === 'protobuf' && !protobufLoading && protobufUsers.length === 0 && (
          <div className="loading">No protobuf data loaded. Click "Protocol Buffers" tab to load data.</div>
        )}
        </div>
      )}

      {/* Charts Tab Content */}
      {activeTab === 'charts' && (
        <ChartDashboard />
      )}
    </div>
  );
}

export default App;
