import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './hooks/useTheme.jsx';
import { LenisProvider } from './lib/lenis.js';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <LenisProvider>
        <App />
      </LenisProvider>
    </ThemeProvider>
  </StrictMode>
);
