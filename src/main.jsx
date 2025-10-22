// src/main.jsx (Configuración para Mantine)

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// 1. Importar MantineProvider y su CSS base
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css'; // <-- Importación del CSS
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* 2. Usar MantineProvider */}
      <MantineProvider> 
        <App />
      </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);