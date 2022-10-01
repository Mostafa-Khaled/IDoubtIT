import React from 'react';
import ReactDOM, { Root } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import './index.css';
import App from './App';

const element = document.getElementById('root') as HTMLDivElement;
const root = ReactDOM.createRoot(element) as Root;
root.render(
  <React.StrictMode>
     <BrowserRouter>
        <App />
     </BrowserRouter>
  </React.StrictMode>
);