import { z } from 'zod';

export const updateLinkSchema = z.object({
  url: z.string({ required_error: 'Url is required' }).url('Url must be a valid url').max(255),
  title: z.string({ required_error: 'Title is required' }).max(255),
  tags: z.array(z.object({})).min(1, 'At least 1 tag required').max(4, 'No more than 4 tags'),
});
