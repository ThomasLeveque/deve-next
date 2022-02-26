import AuthProvider from '@api/auth/useAuth';
import { useSupabaseAuth } from '@api/supabaseAuth/useSupabaseAuth';
import Toast from '@components/elements/toast';
import Layout from '@components/layout';
import { useProfile } from '@store/profile.store';
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
    },
  },
});

export type Page<P = unknown> = NextPage<P> & {
  title?: string;
  description?: string;
};

const MyApp = ({ Component, pageProps }: AppProps & { Component: Page }): JSX.Element => {
  useSupabaseAuth();

  // TODO: to remove
  const profile = useProfile()[0];
  useEffect(() => {
    if (profile) {
      runMigrations(profile.id);
    }
  }, [profile]);

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
