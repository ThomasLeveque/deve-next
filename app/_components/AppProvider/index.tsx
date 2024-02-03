'use client';

import { Provider as JotaiProvider, createStore } from 'jotai';

import ReactQueryClientProvider from '@/app/_components/AppProvider/ReactQueryClientProvider';
import { ThemeProvider } from '@/app/_components/AppProvider/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';

const rootStore = createStore();

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <JotaiProvider store={rootStore}>
        <ReactQueryClientProvider>
          {children}
          <Toaster />
        </ReactQueryClientProvider>
      </JotaiProvider>
    </ThemeProvider>
  );
}
