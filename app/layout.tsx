'use client';

import GlobalComponents from 'app/GlobalComponents';
import classNames from 'classnames';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import 'styles/index.css';

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
  return (
    <html lang="en">
      <body className="font-poppins">
        <QueryClientProvider client={queryClient}>
          <main className={classNames('px-5 xl:container xl:mx-auto')}>{children}</main>

          <ReactQueryDevtools initialIsOpen={false} />
          <GlobalComponents />
        </QueryClientProvider>
      </body>
    </html>
  );
}
