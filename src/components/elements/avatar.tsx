import classNames from 'classnames';
import Image from 'next/image';
import React, { useMemo } from 'react';

import { useAuth } from '@hooks/auth/useAuth';

import { getInitials } from '@utils/format-string';

interface AvatarProps {
  className?: string;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = React.memo((props) => {
  const { user } = useAuth();
  const size = props.size ?? 50;

  const displayNameInitials = useMemo(() => getInitials(user?.displayName ?? ''), [user]);

  return user?.photoURL ? (
    <button className={classNames('flex with-ring rounded-full overflow-hidden', props.className)}>
      <Image src={user?.photoURL} height={size} width={size} priority />
    </button>
  ) : (
    <button
      style={{ height: size, width: size }}
      className={classNames(
        'with-ring bg-gray-100 rounded-full grid place-items-center font-poppins-bold text-lg uppercase',
        props.className
      )}
    >
      {displayNameInitials}
    </button>
  );
});

export default Avatar;
