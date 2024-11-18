import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';  // Asegúrate de que App.js está siendo importado correctamente
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
