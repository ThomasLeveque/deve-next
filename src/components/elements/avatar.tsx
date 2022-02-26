import { useAuth } from '@api/auth/useAuth';
import { getInitials } from '@utils/format-string';
import classNames from 'classnames';
import Image from 'next/image';
import React, { useMemo } from 'react';

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
        'with-ring flex overflow-hidden rounded-full',
        { 'cursor-default': disabled },
        props.className
      )}
    >
      <Image src={user?.photoURL} height={size} width={size} priority alt="Avatar image" />
    </button>
  ) : (
    <button
      disabled={disabled}
      style={{ height: size, width: size, fontSize: size * 0.36 }}
      className={classNames(
        'with-ring grid place-items-center rounded-full bg-gray-100 font-poppins-bold uppercase',
        { 'cursor-default': disabled },
        props.className
      )}
    >
      {displayNameInitials}
    </button>
  );
});

export default Avatar;
