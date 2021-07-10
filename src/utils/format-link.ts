import { Document } from '@libs/types';

import { Link, LinkFormData } from '@data-types/link.type';
import { User } from '@data-types/user.type';

export const formatLink = (formData: LinkFormData, author: Document<User>): Link => ({
  url: formData.url,
  description: formData.title,
  categories: formData.tags,
  postedBy: {
    id: author.id as string,
    displayName: author.displayName as string,
  },
  voteCount: 0,
  commentCount: 0,
  votes: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
});
