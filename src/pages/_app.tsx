import { useAuth } from '@api/auth/useAuth';
import Toast from '@components/elements/toast';
import Layout from '@components/layout';
import { runMigrations } from '@utils/migrations';
import { NextPage } from 'next';
import { AppProps } from 'next/app';
import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import '../../styles/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    },
  },
});

export type Page<P = unknown> = NextPage<P> & {
  title?: string;
  description?: string;
};

const MyApp = ({ Component, pageProps }: AppProps & { Component: Page }): JSX.Element => {
  useAuth();

  useEffect(() => {
    runMigrations();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Layout title={Component.title} description={Component.description}>
        <Component {...pageProps} />
        <ReactQueryDevtools initialIsOpen={false} />
      </Layout>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
        }}
      >
        {(t) => <Toast toast={t} />}
      </Toaster>
    </QueryClientProvider>
  );
};

export default MyApp;
