import { HomeIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import React from 'react';

import Button from '@components/elements/button';

import { Page } from './_app';

const NotFound: Page = () => {
  const router = useRouter();

  return (
    <section className="content-screen-height grid content-center">
      <h1 className="text-5xl mb-3 font-poppins-bold text-center">404 - Not found</h1>
      <p className="text-center mb-9">
        Did you spelled something wrong ? you might double check that URL.
      </p>
      <Button
        className="m-auto"
        icon={<HomeIcon />}
        text="Back home"
        onClick={() => router.push('/')}
      />
    </section>
  );
};

NotFound.title = '404 - Deve-next';

export default NotFound;
