import { NextPage } from 'next';
import { AppProps } from 'next/app';
import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import Toast from '@components/elements/toast';
import Layout from '@components/layout';

import AuthProvider from '@hooks/auth/useAuth';
import { useSupabaseAuth } from '@hooks/supabaseAuth/useSupabaseAuth';

import { runMigrations } from '@utils/migrations';

import '../../styles/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnMount: true,
    },
  },
});

export type Page<P = unknown> = NextPage<P> & {
  title?: string;
  description?: string;
};

const MyApp = ({ Component, pageProps }: AppProps & { Component: Page }): JSX.Element => {
  useSupabaseAuth();

  useEffect(() => {
    // TODO: to remove
    runMigrations();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Layout title={Component.title} description={Component.description}>
          <Component {...pageProps} />
          <ReactQueryDevtools initialIsOpen={false} />
        </Layout>
      </AuthProvider>
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
