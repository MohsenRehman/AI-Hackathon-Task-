import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/index.jsx';
import useAuthStore from './store/authStore.js';
import useUiStore from './store/uiStore.js';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  const hydrateFromServer = useAuthStore((s) => s.hydrateFromServer);
  const theme = useUiStore((s) => s.theme);

  useEffect(() => {
    hydrateFromServer();
  }, [hydrateFromServer]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className={theme === 'dark' ? 'dark' : ''}>
          <AppRoutes />
          <Toaster 
            position="top-right"
            toastOptions={{
              className: 'font-sans text-sm font-semibold border border-surface-border bg-white text-slate-800 shadow-lg',
              duration: 4000,
            }}
          />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
