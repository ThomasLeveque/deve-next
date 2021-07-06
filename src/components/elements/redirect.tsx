import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

type RedirectProps = {
  to: string;
};

const Redirect: React.FC<RedirectProps> = ({ to }) => {
  const router = useRouter();

  useEffect(() => {
    router.push(to);
  }, [to]);

  return null;
};

export default Redirect;
