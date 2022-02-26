import { User } from '@data-types/user.type';
import { Document } from '@utils/shared-types';
import { Comment, CommentFormData } from './../data-types/comment.type';

export const formatComment = (formData: CommentFormData, author: Document<User>): Comment => ({
  text: formData.text,
  postedBy: {
    id: author.id as string,
    displayName: author.displayName as string,
  },
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

export const formatUpdateComment = (formData: CommentFormData): Partial<Document<Comment>> => ({
  text: formData.text,
  updatedAt: Date.now(),
});
