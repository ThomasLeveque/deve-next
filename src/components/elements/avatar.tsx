import classNames from 'classnames';
import Image from 'next/image';
import React, { useMemo } from 'react';

import { useAuth } from '@hooks/auth/useAuth';

import { getInitials } from '@utils/format-string';

interface AvatarProps {
  className?: string;
  size?: number;
  disabled?: boolean;
}

const Avatar: React.FC<AvatarProps> = React.memo((props) => {
  const { user } = useAuth();
  const size = props.size ?? 50;
  const disabled = props.disabled ?? false;

  const displayNameInitials = useMemo(() => getInitials(user?.displayName ?? ''), [user]);

  return user?.photoURL ? (
    <button
      disabled={disabled}
      className={classNames(
        'flex with-ring rounded-full overflow-hidden',
        { 'cursor-default': disabled },
        props.className
      )}
    >
      <Image src={user?.photoURL} height={size} width={size} priority />
    </button>
  ) : (
    <button
      disabled={disabled}
      style={{ height: size, width: size, fontSize: size * 0.36 }}
      className={classNames(
        'with-ring bg-gray-100 rounded-full grid place-items-center font-poppins-bold uppercase',
        { 'cursor-default': disabled },
        props.className
      )}
    >
      {displayNameInitials}
    </button>
  );
});

export default Avatar;
