import { Profile } from './profile';
import { Tag } from './tag';

export interface Link {
  id: number;
  description: string;
  url: string;
  userId: string;
  profiles: Profile;
  tags: Tag[];
  createdAt: Date;
  updatedAt: Date;
}
