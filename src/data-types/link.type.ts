import { PostedByUser, VoteByUser } from './user.type';

export interface Vote {
  voteBy: VoteByUser;
}

export interface Link {
  url: string;
  description: string;
  categories: string[];
  postedBy: PostedByUser;
  voteCount: number;
  commentCount: number;
  votes: Vote[];
  createdAt: number;
  updatedAt: number;
}

export interface LinkFormData {
  url: string;
  title: string;
  tags: string[];
}
