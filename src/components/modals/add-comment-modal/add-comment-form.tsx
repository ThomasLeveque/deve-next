import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import Button from '@components/elements/button';
import TextArea from '@components/elements/textarea';

import { useAuth } from '@hooks/auth/useAuth';
import { dbKeys } from '@hooks/link/db-keys';
import { useAddLinkComment } from '@hooks/link/use-add-link-comment';
import { useLinksQueryKey } from '@hooks/link/use-links-query-key';

import { CommentFormData } from '@data-types/comment.type';
import { Link } from '@data-types/link.type';

import { addCommentSchema } from '@utils/form-schemas';
import { formatComment } from '@utils/format-comment';
import { formatError } from '@utils/format-string';
import { db } from '@utils/init-firebase';
import { Document } from '@utils/shared-types';

interface AddCommentFormProps {
  closeModal: () => void;
  link: Document<Link>;
}

const AddCommentForm: React.FC<AddCommentFormProps> = (props) => {
  const { user } = useAuth();
  const linkId = props.link.id as string;

  const linksQueryKey = useLinksQueryKey(user?.id as string);

  const addLinkComment = useAddLinkComment(props.link, linksQueryKey);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CommentFormData>({
    resolver: yupResolver(addCommentSchema),
  });

  const onSubmit = useCallback(
    (formData: CommentFormData) => {
      try {
        if (!user) {
          throw new Error('You must be login');
        }
        const commentRef = db.collection(dbKeys.comments(linkId)).doc();

        const comment = formatComment(formData, user);
        addLinkComment.mutate({ commentRef, comment });

        reset();
      } catch (err) {
        toast.error(formatError(err));
        console.error(err);
      }
    },
    [user, linkId]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextArea
        id="link-comment"
        className="mb-8"
        placeholder="Leave your comment here..."
        {...register('text')}
        errorText={errors.text?.message}
      />
      <div className="flex justify-end">
        <Button theme="secondary" text="Add" type="submit" />
      </div>
    </form>
  );
};

export default AddCommentForm;
