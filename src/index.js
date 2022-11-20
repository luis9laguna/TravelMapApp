import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AuthState from './context/auth/authState';
import PinsState from './context/pins/pinsState';

ReactDOM.render(
  <React.StrictMode>
    <AuthState>
      <PinsState>
        <App />
      </PinsState>
    </AuthState>
  </React.StrictMode>,
  document.getElementById('root')
);
