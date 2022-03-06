import { Link } from './link';
import { Profile } from './profile';

export interface Comment {
  id: number;
  text: string;
  linkId: number;
  link?: Link;
  userId: string;
  user?: Profile;
  createdAt: Date;
  updatedAt: Date;
}
