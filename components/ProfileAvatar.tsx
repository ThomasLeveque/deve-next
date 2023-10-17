import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useProfile } from '@/store/profile.store';
import { getInitials } from '@/utils/format-string';
import { ComponentProps, useMemo } from 'react';

export function ProfileAvatar(props: ComponentProps<typeof Avatar>) {
  const profile = useProfile()[0];

  const displayNameInitials = useMemo(() => getInitials(profile?.username ?? ''), [profile]);

  return (
    <Avatar {...props}>
      <AvatarImage src={profile?.avatarUrl} />
      <AvatarFallback>{displayNameInitials}</AvatarFallback>
    </Avatar>
  );
}
