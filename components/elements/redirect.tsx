import { useCustomRouter } from '@hooks/useCustomRouter';
import React, { useEffect } from 'react';

type RedirectProps = {
  to: string;
};

const Redirect: React.FC<RedirectProps> = ({ to }) => {
  const router = useCustomRouter();

  useEffect(() => {
    router.push(to);
  }, [to]);

  return null;
};

export default Redirect;
