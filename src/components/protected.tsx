import { useAuth } from '@api/auth/useAuth';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import SpinnerIcon from './icons/spinner-icon';

const Protected: React.FC = (props) => {
  const { user, userLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user && userLoaded) {
      router.push('/');
    }
  }, [user]);

  return user ? <>{props.children}</> : <SpinnerIcon className="m-auto mt-14 w-10" />;
};

export default Protected;
