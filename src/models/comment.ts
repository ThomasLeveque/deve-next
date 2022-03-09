import { Nullable } from '@utils/shared-types';
import { Link } from './link';
import { Profile } from './profile';

export interface Comment {
  id: number;
  text: string;
  linkId: number;
  link?: Nullable<Link>;
  userId: string;
  user?: Nullable<Profile>;
  createdAt: Date;
  updatedAt: Date;
}
