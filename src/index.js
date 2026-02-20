// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './context/userContext'; 
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider> 
      <BrowserRouter> {/* تغليف الراوتر ضروري إذا كنت تستخدم التنقل داخل App */}
        <App />
      </BrowserRouter>
    </UserProvider>
  </React.StrictMode>
);

reportWebVitals();