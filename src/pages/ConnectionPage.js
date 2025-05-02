// Modified ConnectionPage.jsx with environment variables
import React, { useState } from 'react';

function ConnectionPage({ onConnect, initialConfig }) {
  const [config, setConfig] = useState({
    host: initialConfig.host || '192.168.0.124',
    port: initialConfig.port || '1883',
    username: initialConfig.username || '',
    password: initialConfig.password || '',
    topic: initialConfig.topic || 'test'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const API_BASE = `http://${config.host}:5001`;

      const response = await fetch(`${API_BASE}/api/test-connection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      const data = await response.json();

      if (data.success) {
        onConnect(config);
      } else {
        setError(data.message || 'Failed to connect to MQTT broker');
      }
    } catch (err) {
      setError('Server error: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">MQTT Connector</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Form contents remain the same */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 pb-2 border-b border-gray-200 mb-4">
              Broker Connection
            </h2>
            
            <div className="mb-4">
              <label htmlFor="host" className="block text-gray-600 font-medium mb-1">
                MQTT Broker Host:
              </label>
              <input
                type="text"
                id="host"
                name="host"
                value={config.host}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 192.168.0.124"
              />
            </div>

            {/* Other form fields remain the same */}
            <div className="mb-4">
              <label htmlFor="port" className="block text-gray-600 font-medium mb-1">
                Port:
              </label>
              <input
                type="text"
                id="port"
                name="port"
                value={config.port}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 1883"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-600 font-medium mb-1">
                Username (optional):
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={config.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-600 font-medium mb-1">
                Password (optional):
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={config.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="topic" className="block text-gray-600 font-medium mb-1">
                Topic:
              </label>
              <input
                type="text"
                id="topic"
                name="topic"
                value={config.topic}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., test"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            }`}
          >
            {loading ? 'Connecting...' : 'Connect'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ConnectionPage;