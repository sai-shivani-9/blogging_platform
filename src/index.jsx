import React from 'react';
import ReactDOM from 'react-dom/client'; // Use createRoot for React 18+// This is where Tailwind CSS would be imported/configured
import App from './App'; // Import your main App component

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);