import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot
import App from './App';

// 1. Find the DOM element where your app will live
const container = document.getElementById('root');

// 2. Create a root for your app
const root = createRoot(container);

// 3. Render your App component into the root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


