// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import CustomThemeProvider from './context/ThemeContext'; // Import the CustomThemeProvider
//import AuthProvider from './context/AuthContext'; // If you're using authentication

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    { /*<AuthProvider> If using authentication */}
      <CustomThemeProvider>
        <App />
      </CustomThemeProvider>
    {/* </AuthProvider> */}
  </React.StrictMode>
);
