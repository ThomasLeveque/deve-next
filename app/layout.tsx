'use client';

import { useAuth } from '@api/auth/useAuth';
import { GlobalComponents } from '@components/GlobalComponents';
import Header from '@components/header';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import classNames from 'classnames';
import '../styles/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useAuth();

  return (
    <html lang="en">
      <body className="font-poppins">
        <QueryClientProvider client={queryClient}>
          <Header />
          <main className={classNames('px-5 xl:container xl:mx-auto')}>{children}</main>

          <ReactQueryDevtools initialIsOpen={false} />
          <GlobalComponents />
        </QueryClientProvider>
      </body>
    </html>
  );
}
