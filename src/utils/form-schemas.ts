import * as yup from 'yup';
import { validUrlRegex } from './format-string';

const userDisplayNameSchema = yup.string().required('Username is required').max(255);
const userEmailSchema = yup.string().email('Email must be a valid email').required('Email is required').max(255);
const userPasswordSchema = yup
  .string()
  .required('Password is required')
  .min(6, 'Password must be at least 6 characters')
  .max(255);

export const resetPasswordSchema = yup.object().shape({
  email: userEmailSchema,
});

export const signInSchema = yup.object().shape({
  email: userEmailSchema,
  password: userPasswordSchema,
});
export const signUpSchema = yup.object().shape({
  displayName: userDisplayNameSchema,
  email: userEmailSchema,
  password: userPasswordSchema,
});

export const commentMaxLength = 1000;
const commentSchema = {
  text: yup.string().required('Comment is required').max(commentMaxLength),
};

export const addCommentSchema = yup.object().shape(commentSchema);

const linkSchema = {
  url: yup.string().required('Url is required').matches(validUrlRegex, { message: 'Url must be a valid url' }).max(255),
  title: yup.string().required('Title is required').max(255),
  tags: yup
    .array(yup.string())
    .required('At least 1 tag required')
    .min(1, 'At least 1 tag required')
    .max(4, 'No more than 4 tags'),
};

export const addLinkSchema = yup.object().shape(linkSchema);

export const updateLinkSchema = yup.object().shape(linkSchema);
