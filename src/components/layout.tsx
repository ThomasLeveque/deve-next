import React from 'react';

import Header from '@components/header';

import { useAuth } from '@hooks/useAuth';

import Redirect from './redirect';

const Layout: React.FC = ({ children }) => {
  const { user, userLoaded } = useAuth();

  if (!user && userLoaded) {
    return <Redirect to="/" />;
  }

  return (
    <main className="xl:container xl:mx-auto">
      <Header />
      {children}
    </main>
  );
};

export default Layout;
