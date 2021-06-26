import React from 'react';

import Header from '@components/header';

import { useAuth } from '@hooks/useAuth';

import LoginModal from './modals/login-modal/login-modal';
import Redirect from './redirect';

const Layout: React.FC = ({ children }) => {
  const { user, userLoaded } = useAuth();

  // if (!user && userLoaded) {
  //   return <Redirect to="/" />;
  // }

  return (
    <>
      <Header />
      <main className="xl:container xl:mx-auto px-5 mt-8">{children}</main>
      <LoginModal />
    </>
  );
};

export default Layout;
