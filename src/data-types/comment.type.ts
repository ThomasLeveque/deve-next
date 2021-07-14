import { PostedByUser } from './user.type';

export interface Comment {
  postedBy: PostedByUser;
  createdAt: number;
  updatedAt: number;
  text: string;
}

export interface CommentFormData {
  text: string;
}
