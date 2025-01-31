'use client';

import React from 'react';
import { useAuth } from './auth-context';

export function DevTools() {
  const { user, login, logout } = useAuth();

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      padding: '15px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      zIndex: 9999,
    }}>
      <div style={{ marginBottom: '10px' }}>
        {user ? (
          <div>
            <div style={{ marginBottom: '8px' }}>
              Logged in as: {user.name}
            </div>
            <button
              onClick={logout}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={login}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Login as Admin
          </button>
        )}
      </div>
    </div>
  );
}

export default DevTools;
