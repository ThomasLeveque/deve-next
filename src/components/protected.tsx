import { useProfile, useProfileLoaded } from '@store/profile.store';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import SpinnerIcon from './icons/spinner-icon';

const Protected: React.FC = (props) => {
  const profile = useProfile()[0];
  const profileLoaded = useProfileLoaded()[0];

  const router = useRouter();

  useEffect(() => {
    if (!profile && profileLoaded) {
      router.push('/');
    }
  }, [profile, profileLoaded, router]);

  return profile ? <>{props.children}</> : <SpinnerIcon className="m-auto mt-14 w-10" />;
};

export default Protected;
