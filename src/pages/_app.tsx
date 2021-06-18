import { AppProps } from 'next/app';
import React from 'react';

import AuthProvider from '@hooks/useAuth';

import '../../styles/index.css';

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
};

export default MyApp;
