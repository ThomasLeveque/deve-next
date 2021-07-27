import { Link, LinkFormData } from '@data-types/link.type';
import { User } from '@data-types/user.type';

import { Document } from '@utils/shared-types';

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

export const formatUpdatedLink = (formData: LinkFormData): Partial<Document<Link>> => ({
  url: formData.url,
  description: formData.title,
  categories: formData.tags,
  updatedAt: Date.now(),
});
