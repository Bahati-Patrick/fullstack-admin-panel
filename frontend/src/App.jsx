import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // State management - data that can change
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Form state for creating/editing users
  const [formData, setFormData] = useState({
    email: '',
    role: 'user',
    status: 'active'
  });
  const [editingUser, setEditingUser] = useState(null);

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users');
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users: ' + (err.response?.data?.error || err.message));
      
      // Auto-dismiss error message after 5 seconds
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  // Load users when component mounts
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
        <p>Users Management</p>
      </div>

      {/* Error/Success Messages */}
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {/* User Form */}
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

      {/* Users Table */}
      <div className="card">
        <h2>Users List</h2>
        {loading ? (
          <div className="loading">Loading users...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
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
        )}
        
        {!loading && users.length === 0 && (
          <div className="loading">No users found. Create your first user above!</div>
        )}
      </div>
    </div>
  );
}

export default App;
