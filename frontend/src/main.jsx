/**
 * Punto de entrada principal de la aplicación React
 *
 * Este archivo inicializa la aplicación y la monta
 * en el elemento root del DOM.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Crear el root de la aplicación
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderizar la aplicación
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
