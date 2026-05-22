import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { FirebaseProvider } from './context/FirebaseContext.tsx';
import SecurityShield from './components/SecurityShield.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FirebaseProvider>
      <SecurityShield>
        <App />
      </SecurityShield>
    </FirebaseProvider>
  </StrictMode>,
);
