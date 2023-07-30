import z from 'zod';

const userDisplayNameSchema = z
  .string({
    required_error: 'Username is required',
  })
  .max(255);
const userEmailSchema = z.string({ required_error: 'Email is required' }).email('Email must be a valid email').max(255);
const userPasswordSchema = z
  .string({ required_error: 'Password is required' })
  .min(6, 'Password must be at least 6 characters')
  .max(255);

export const resetPasswordSchema = z.object({
  email: userEmailSchema,
});

export const signInSchema = z.object({
  email: userEmailSchema,
  password: userPasswordSchema,
});
export const signUpSchema = z.object({
  displayName: userDisplayNameSchema,
  email: userEmailSchema,
  password: userPasswordSchema,
});

export const commentMaxLength = 1000;
const commentSchema = {
  text: z.string({ required_error: 'Comment is required' }).max(commentMaxLength),
};

export const addCommentSchema = z.object(commentSchema);

const linkSchema = {
  url: z.string({ required_error: 'Url is required' }).url('Url must be a valid url').max(255),
  title: z.string({ required_error: 'Title is required' }).max(255),
  tags: z.array(z.object({})).min(1, 'At least 1 tag required').max(4, 'No more than 4 tags'),
};

export const addLinkSchema = z.object(linkSchema);

export const updateLinkSchema = z.object(linkSchema);
