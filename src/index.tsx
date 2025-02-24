import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import axios from 'axios';

// Axios varsayılan ayarları
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:80/api';
axios.defaults.headers.common['Content-Type'] = 'application/json';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
); 