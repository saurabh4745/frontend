import React, { useState } from 'react';

function PublishPage({ config, onDisconnect }) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected'); // 'connected' or 'disconnected'

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setLoading(true);
    setStatus('');

    try {
      const API_BASE = 'http://localhost:5001';

      const response = await fetch(`${API_BASE}/api/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          host: config.host,
          port: config.port,
          username: config.username,
          password: config.password,
          topic: config.topic,
          message: name
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setStatus({ type: 'success', message: 'Name published successfully!' });
        setName('');
      } else {
        setStatus({ type: 'error', message: data.message || 'Failed to publish name' });
        if (data.message.toLowerCase().includes('connect') || data.message.toLowerCase().includes('broker')) {
          setConnectionStatus('disconnected');
        }
      }
    } catch (err) {
      setStatus({
        type: 'error',
        message: 'Server error: ' + (err.message || 'Unknown error')
      });
      setConnectionStatus('disconnected');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectionAction = () => {
    if (connectionStatus === 'connected') {
      onDisconnect();
    } else {
      refreshConnection();
    }
  };

  const refreshConnection = async () => {
    setStatus({ type: 'info', message: 'Testing connection...' });
    
    try {
      const API_BASE = 'http://localhost:5001';
      const response = await fetch(`${API_BASE}/api/test-connection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      const data = await response.json();
      
      if (data.success) {
        setStatus({ type: 'success', message: 'Connection restored successfully!' });
        setConnectionStatus('connected');
      } else {
        setStatus({ type: 'error', message: data.message || 'Failed to reconnect' });
      }
    } catch (err) {
      setStatus({
        type: 'error',
        message: 'Server error: ' + (err.message || 'Unknown error')
      });
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Status icon in top right corner */}
      <div className="absolute top-4 right-4">
        <button 
          onClick={handleConnectionAction}
          className="p-2 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          title={connectionStatus === 'connected' ? 'Disconnect' : 'Refresh connection'}
        >
          {connectionStatus === 'connected' ? (
            <div className="w-4 h-4 bg-gray-500" title="Connected - Click to disconnect"></div>
          ) : (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-blue-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              title="Disconnected - Click to refresh"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
          )}
        </button>
      </div>

      <div className="flex-1 flex justify-center items-center p-4">
        <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Publish Name</h1>
          
          <div className="mb-4 text-center text-gray-600">
            Connected to: <span className="font-semibold">{config.host}:{config.port}</span>
          </div>
          
          <div className="mb-6 text-center">
            Publishing to topic: <span className="font-bold">{config.topic}</span>
          </div>
          
          {status && (
            <div className={`mb-6 p-4 border rounded ${
              status.type === 'success' ? 'bg-green-100 border-green-400 text-green-700' :
              status.type === 'error' ? 'bg-red-100 border-red-400 text-red-700' :
              'bg-blue-100 border-blue-400 text-blue-700'
            }`}>
              {status.message}
            </div>
          )}
          
          <form onSubmit={handlePublish}>
            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-600 font-medium mb-2">
                Enter Name to Publish:
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={handleNameChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={connectionStatus === 'disconnected'}
              />
            </div>
            
            <div className="flex flex-col space-y-4">
              <button
                type="submit"
                disabled={loading || !name.trim() || connectionStatus === 'disconnected'}
                className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
                  loading || !name.trim() || connectionStatus === 'disconnected'
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                }`}
              >
                {loading ? 'Publishing...' : 'Publish Name'}
              </button>
              
              <button
                type="button"
                onClick={onDisconnect}
                className="w-full py-3 px-4 rounded-md text-gray-700 font-medium bg-gray-200 hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Disconnect
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PublishPage;