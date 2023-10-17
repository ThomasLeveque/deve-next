import { useAuth } from '@/data/auth/useAuth';
import { PropsWithChildren } from 'react';

export function AuthProvider({ children }: PropsWithChildren) {
  useAuth();

  return <>{children}</>;
}
