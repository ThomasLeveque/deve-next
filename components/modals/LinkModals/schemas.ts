import { z } from 'zod';

export const linkSchema = z.object({
  url: z
    .string({ required_error: 'Url is required' })
    .min(1, 'Url is required')
    .max(255)
    .url('Url must be a valid url'),
  title: z.string({ required_error: 'Title is required' }).min(1, 'Title is required').max(255),
  tags: z.array(z.number()).min(1, 'At least 1 tag required').max(4, 'No more than 4 tags'),
});
