import { Link } from './link';
import { Profile } from './profile';

export interface Comment {
  id: number;
  text: string;
  linkId: number;
  links: Link;
  userId: string;
  profiles: Profile;
  createdAt: Date;
  updatedAt: Date;
}
