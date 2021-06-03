import React from 'react';

import { useAuth } from '@hooks/useAuth';

const AuthLoading: React.FC = ({ children }) => {
  const { userLoaded } = useAuth();

  return <>{userLoaded ? children : <p>loading auth...</p>}</>;
};

export default AuthLoading;
