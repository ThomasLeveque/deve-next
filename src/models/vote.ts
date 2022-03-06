import { Link } from './link';
import { Profile } from './profile';

export interface Vote {
  id: number;
  linkId: number;
  link: Link;
  userId: string;
  user?: Profile;
  createdAt: Date;
}
