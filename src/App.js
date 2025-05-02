import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ConnectionPage from './pages/ConnectionPage';
import PublishPage from './pages/PublishPage';

function App() {
  const [connectionConfig, setConnectionConfig] = useState({
    host: '',
    port: '',
    username: '',
    password: '',
    isConnected: false,
    topic: 'test' // Default topic
  });

  const handleConnection = (config) => {
    setConnectionConfig({
      ...config,
      isConnected: true
    });
  };

  const handleDisconnect = () => {
    setConnectionConfig({
      ...connectionConfig,
      isConnected: false
    });
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route 
            path="/" 
            element={
              connectionConfig.isConnected ? (
                <Navigate to="/publish" replace />
              ) : (
                <ConnectionPage 
                  onConnect={handleConnection} 
                  initialConfig={connectionConfig}
                />
              )
            } 
          />
          <Route 
            path="/publish" 
            element={
              connectionConfig.isConnected ? (
                <PublishPage 
                  config={connectionConfig} 
                  onDisconnect={handleDisconnect}
                />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;