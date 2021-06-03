import Link from 'next/link';
import React from 'react';

import { useAuth } from '@hooks/useAuth';

const Header: React.FC = () => {
  const { signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <header className="py-3 px-6 flex justify-end">
      <Link href="/dashboard">
        <a className="p-2">Dashboard</a>
      </Link>
      <Link href="/account">
        <a className="p-2">Account</a>
      </Link>
      <button className="p-2" onClick={handleSignOut}>
        Logout
      </button>
    </header>
  );
};

export default Header;
