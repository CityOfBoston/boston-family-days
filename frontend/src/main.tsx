import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.tsx';
import styles from "./index.css?inline";
import './i18n';

createRoot(document.getElementById('boston-family-days')!.attachShadow({ mode: "open" })).render(
  <StrictMode>
    <style type='text/css'>{styles}</style>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
)
