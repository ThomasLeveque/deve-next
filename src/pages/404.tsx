import Button from '@components/elements/button';
import { HomeIcon } from '@heroicons/react/24/outline';
import { useCustomRouter } from '@hooks/useCustomRouter';
import { Page } from './_app';

const NotFound: Page = () => {
  const router = useCustomRouter();

  return (
    <section className="content-screen-height grid content-center">
      <h1 className="mb-3 text-center font-poppins-bold text-5xl">404 - Not found</h1>
      <p className="mb-9 text-center">Did you spelled something wrong ? you might double check that URL.</p>
      <Button className="m-auto" icon={<HomeIcon />} text="Back home" onClick={() => router.push('/')} />
    </section>
  );
};

NotFound.title = '404 - Deve-next';

export default NotFound;
