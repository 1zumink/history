import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@fontsource/caveat/400.css';
import '@fontsource/caveat/600.css';
import 'lenis/dist/lenis.css';
import './styles/fonts.css';
import './styles/global.css';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
