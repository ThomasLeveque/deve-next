import { Link } from './link';
import { Profile } from './profile';

export interface Vote {
  id: number;
  linkId: number;
  links: Link;
  userId: string;
  profiles: Profile;
  createdAt: Date;
}
