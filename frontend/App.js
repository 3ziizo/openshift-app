import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Get API URL from environment or runtime config
const getApiUrl = () => {
  // Try runtime config first (for containerized deployment)
  if (window.ENV && window.ENV.REACT_APP_API_URL) {
    return window.ENV.REACT_APP_API_URL;
  }
  // Fall back to build-time environment variable
  return process.env.REACT_APP_API_URL || '/api';
};

const API_BASE_URL = getApiUrl();

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch items from backend
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      console.log('Fetching from:', `${API_BASE_URL}/items`);
      const response = await axios.get(`${API_BASE_URL}/items`);
      setItems(response.data);
      setError('');
    } catch (err) {
      setError(`Failed to fetch items from ${API_BASE_URL}. Make sure the backend is running.`);
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/items`, newItem);
      setItems([...items, response.data]);
      setNewItem({ name: '', description: '' });
      setError('');
    } catch (err) {
      setError('Failed to add item');
      console.error('Error adding item:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/items/${id}`);
      setItems(items.filter(item => item.id !== id));
      setError('');
    } catch (err) {
      setError('Failed to delete item');
      console.error('Error deleting item:', err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Full-Stack OpenShift Application</h1>
        <p>React Frontend + Node.js Backend + PostgreSQL</p>
        <small>API URL: {API_BASE_URL}</small>
      </header>

      <main className="App-main">
        {error && <div className="error-message">{error}</div>}
        
        <section className="add-item-section">
          <h2>Add New Item</h2>
          <form onSubmit={addItem} className="add-item-form">
            <input
              type="text"
              placeholder="Item name"
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              disabled={loading}
            />
            <input
              type="text"
              placeholder="Item description"
              value={newItem.description}
              onChange={(e) => setNewItem({...newItem, description: e.target.value})}
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Item'}
            </button>
          </form>
        </section>

        <section className="items-section">
          <div className="section-header">
            <h2>Items ({items.length})</h2>
            <button onClick={fetchItems} disabled={loading} className="refresh-btn">
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          
          {items.length === 0 ? (
            <p className="no-items">No items found. Add some items above!</p>
          ) : (
            <div className="items-grid">
              {items.map((item) => (
                <div key={item.id} className="item-card">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <div className="item-meta">
                    <span>ID: {item.id}</span>
                    <span>Created: {new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                  <button 
                    onClick={() => deleteItem(item.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;