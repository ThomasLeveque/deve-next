import Image from 'next/image';
import React, { useMemo } from 'react';

import { useAuth } from '@hooks/useAuth';

import { getInitials } from '@utils/format-string';

const Avatar: React.FC = () => {
  const { user } = useAuth();

  const displayNameInitials = useMemo(() => getInitials(user?.displayName ?? ''), [user]);

  return user?.photoURL ? (
    <Image src={user?.photoURL} height={56} width={56} priority className="rounded-full" />
  ) : (
    <button className="h-[56px] w-[56px] with-ring bg-gray-100 rounded-full grid place-items-center font-poppins-bold text-lg uppercase">
      {displayNameInitials}
    </button>
  );
};

export default Avatar;
