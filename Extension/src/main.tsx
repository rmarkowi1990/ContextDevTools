import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { StateProvider } from './Providers/StateProvider';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <StateProvider>
            <App />
        </StateProvider>
    </StrictMode>
);
