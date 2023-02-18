import { useSupabase } from '@components/SupabaseAuthProvider';
import { useCustomRouter } from '@hooks/useCustomRouter';
import { useProfileLoaded } from '@store/profile.store';
import React, { useEffect } from 'react';
import SpinnerIcon from './icons/spinner-icon';

interface ProtectedProps {
  children: React.ReactNode | React.ReactNode[];
}

const Protected: React.FC<ProtectedProps> = (props) => {
  const { profile } = useSupabase();
  const profileLoaded = useProfileLoaded()[0];

  const router = useCustomRouter();

  useEffect(() => {
    if (!profile && profileLoaded) {
      router.push('/');
    }
  }, [profile, profileLoaded, router]);

  return profile ? <>{props.children}</> : <SpinnerIcon className="m-auto mt-14 w-10" />;
};

export default Protected;
