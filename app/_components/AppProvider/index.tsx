'use client';

import { Provider as JotaiProvider, createStore } from 'jotai';

import { AuthProvider } from '@/app/_components/AppProvider/AuthProvider';
import ReactQueryClientProvider from '@/app/_components/AppProvider/ReactQueryClientProvider';
import { Toaster } from '@/components/ui/toaster';

const rootStore = createStore();

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider store={rootStore}>
      <ReactQueryClientProvider>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </ReactQueryClientProvider>
    </JotaiProvider>
  );
}
