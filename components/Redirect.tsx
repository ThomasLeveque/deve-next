import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type RedirectProps = {
  to: string;
};

function Redirect({ to }: RedirectProps) {
  const router = useRouter();

  useEffect(() => {
    router.push(to);
  }, [to]);

  return null;
}

export default Redirect;
