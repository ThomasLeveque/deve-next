import { useProfile, useProfileLoaded } from '@/store/profile.store';
import { useRouter } from 'next/navigation';
import { PropsWithChildren, useEffect } from 'react';
import SpinnerIcon from './icons/SpinnerIcon';

export function AuthProtected({ children }: PropsWithChildren) {
  const profile = useProfile()[0];
  const profileLoaded = useProfileLoaded()[0];

  const router = useRouter();

  useEffect(() => {
    if (!profile && profileLoaded) {
      router.push('/');
    }
  }, [profile, profileLoaded, router]);

  return profile ? <>{children}</> : <SpinnerIcon size={40} className="m-auto mt-14" />;
}

export default AuthProtected;
