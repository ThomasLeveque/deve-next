'use client';

import BackToTop from '@/components/back-to-top';
import Toast from '@/components/elements/toast';
import { useAuth } from '@/data/auth/useAuth';
import { Toaster } from 'react-hot-toast';

export function GlobalComponents() {
  useAuth();

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
        }}
      >
        {(t) => <Toast toast={t} />}
      </Toaster>
      <BackToTop />
    </>
  );
}
