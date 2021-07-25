import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Button from '@components/elements/button';
import TextArea from '@components/elements/textarea';

import { useAuth } from '@hooks/auth/useAuth';
import { dbKeys } from '@hooks/link/db-keys';
import { useAddLinkComment } from '@hooks/link/use-add-link-comment';
import { useLinksQueryKey } from '@hooks/link/use-links-query-key';

import { CommentFormData } from '@data-types/comment.type';
import { Link } from '@data-types/link.type';

import { formatComment } from '@utils/format-comment';
import { db } from '@utils/init-firebase';
import { Document } from '@utils/shared-types';

const schema = yup.object().shape({
  text: yup.string().required('Comment is required').max(255),
});

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
    resolver: yupResolver(schema),
  });

  const onSubmit = useCallback(
    async (formData: CommentFormData) => {
      if (!user) {
        return;
      }
      const commentRef = db.collection(dbKeys.comments(linkId)).doc();

      const comment = formatComment(formData, user);
      addLinkComment.mutate({ commentRef, comment });

      reset();
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
