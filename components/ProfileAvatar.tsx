import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FetchProfileReturn } from '@/lib/queries/fetch-profile';
import { getInitials } from '@/utils/format-string';
import Image from 'next/image';
import { ComponentProps } from 'react';

type ProfileAvatarProps = ComponentProps<typeof Avatar> & {
  profile: NonNullable<FetchProfileReturn>;
  fallbackProps?: Omit<ComponentProps<typeof Image>, 'src' | 'alt'>;
};

export function ProfileAvatar({ profile, fallbackProps, ...props }: ProfileAvatarProps) {
  const displayNameInitials = getInitials(profile.username);

  const avatarUrl = profile.avatarUrl;

  return (
    <Avatar {...props}>
      <AvatarImage src={avatarUrl} alt={`${profile.username} avatar photo`} />
      <AvatarFallback>
        {avatarUrl ? (
          <Image src={profile.avatarUrl} alt={`${profile.username} avatar photo`} {...fallbackProps} />
        ) : (
          displayNameInitials
        )}
      </AvatarFallback>
    </Avatar>
  );
}
