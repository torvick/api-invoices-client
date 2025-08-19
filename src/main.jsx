import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './app/routes.jsx';
import Providers from './app/providers.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Providers>
      <AppRoutes />
    </Providers>
  </React.StrictMode>
);
