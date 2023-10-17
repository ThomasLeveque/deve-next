import z from 'zod';

export const commentMaxLength = 1000;

export const addCommentSchema = z.object({
  text: z.string({ required_error: 'Comment is required' }).max(commentMaxLength),
});
