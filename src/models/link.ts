import { Profile } from './profile';
import { Tag } from './tag';
import { Vote } from './vote';

export interface Link {
  id: number;
  description: string;
  url: string;
  userId: string;
  user?: Profile;
  tags?: Tag[];
  comments?: Comment[];
  commentsCount: number;
  votes?: Vote[];
  votesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface LinksTags {
  id: number;
  linkId: number;
  Link?: Link;
  tagId: number;
  Tag?: Tag;
  createdAt: string;
}
