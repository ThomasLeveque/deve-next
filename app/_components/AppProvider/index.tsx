'use client';

import { Provider as JotaiProvider, createStore } from 'jotai';

import { AuthProvider } from '@/app/_components/AppProvider/AuthProvider';
import ReactQueryClientProvider from '@/app/_components/AppProvider/ReactQueryClientProvider';
import Toast from '@/components/Toast';
import { Toaster } from 'react-hot-toast';

const rootStore = createStore();

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider store={rootStore}>
      <ReactQueryClientProvider>
        <AuthProvider>
          {children}

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 5000,
            }}
          >
            {(t) => <Toast toast={t} />}
          </Toaster>
        </AuthProvider>
      </ReactQueryClientProvider>
    </JotaiProvider>
  );
}
