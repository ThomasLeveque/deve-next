import { Document } from '@libs/types';

import { User } from '@data-types/user.type';

import { CommentFormData, Comment } from './../data-types/comment.type';

export const formatComment = (formData: CommentFormData, author: Document<User>): Comment => ({
  text: formData.text,
  postedBy: {
    id: author.id as string,
    displayName: author.displayName as string,
  },
  createdAt: Date.now(),
  updatedAt: Date.now(),
});
