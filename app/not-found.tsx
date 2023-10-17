import { Button } from '@/components/ui/ButtonToto';
import { HomeIcon } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: '404',
};

export default function NotFound() {
  return (
    <section className="content-screen-height grid content-center">
      <h1 className="font-poppins-bold mb-3 text-center text-5xl">404 - Not found</h1>
      <p className="mb-9 text-center">Did you spelled something wrong ? you might double check that URL.</p>
      <Link href="/">
        <Button className="m-auto">
          <HomeIcon className="mr-2" />
          Back home
        </Button>
      </Link>
    </section>
  );
}
