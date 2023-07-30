import { useProfile } from '@/store/profile.store';
import { cn } from '@/utils/cn';
import { getInitials } from '@/utils/format-string';
import Image from 'next/image';
import React, { useMemo } from 'react';

interface AvatarProps {
  className?: string;
  size?: number;
  disabled?: boolean;
}

const Avatar: React.FC<AvatarProps> = React.memo((props) => {
  const profile = useProfile()[0];
  const size = props.size ?? 50;
  const disabled = props.disabled ?? false;

  const displayNameInitials = useMemo(() => getInitials(profile?.username ?? ''), [profile]);

  return profile?.avatarUrl ? (
    <button
      disabled={disabled}
      className={cn('with-ring flex overflow-hidden rounded-full', { 'cursor-default': disabled }, props.className)}
    >
      <Image src={profile?.avatarUrl} height={size} width={size} priority alt="Avatar image" />
    </button>
  ) : (
    <button
      disabled={disabled}
      style={{ height: size, width: size, fontSize: size * 0.36 }}
      className={cn(
        'with-ring grid place-items-center rounded-full bg-gray-100 font-bold uppercase',
        { 'cursor-default': disabled },
        props.className
      )}
    >
      {displayNameInitials}
    </button>
  );
});

export default Avatar;
