import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { useAuth } from '@api/auth/useAuth';

import SpinnerIcon from './icons/spinner-icon';

const Protected: React.FC = (props) => {
  const { user, userLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user && userLoaded) {
      router.push('/');
    }
  }, [user]);

  return user ? <>{props.children}</> : <SpinnerIcon className="w-10 m-auto mt-14" />;
};

export default Protected;
