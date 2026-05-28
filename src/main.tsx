import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { FirebaseProvider } from './context/FirebaseContext.tsx';
import SecurityShield from './components/SecurityShield.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <FirebaseProvider>
        <SecurityShield>
          <App />
        </SecurityShield>
      </FirebaseProvider>
    </BrowserRouter>
  </StrictMode>,
);
