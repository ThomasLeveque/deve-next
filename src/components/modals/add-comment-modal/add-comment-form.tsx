import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Button from '@components/elements/button';
import TextArea from '@components/elements/textarea';

import { useAuth } from '@hooks/auth/useAuth';
import { dbKeys } from '@hooks/link/db-keys';
import { useAddLinkComment } from '@hooks/link/use-add-link-comment';
import { useUpdateLink } from '@hooks/link/use-update-link';
import { useQueryString } from '@hooks/use-query-string';

import { CommentFormData } from '@data-types/comment.type';
import { Link } from '@data-types/link.type';

import { formatComment } from '@utils/format-comment';
import { db } from '@utils/init-firebase';
import { Document } from '@utils/shared-types';

const schema = yup.object().shape({
  text: yup.string().required('An text is required').max(255),
});

interface AddCommentFormProps {
  closeModal: () => void;
  link: Document<Link>;
}

const AddCommentForm: React.FC<AddCommentFormProps> = (props) => {
  const { user } = useAuth();
  const linkId = props.link.id as string;

  const { tagsQuery, orderbyQuery } = useQueryString();
  const addLinkComment = useAddLinkComment(linkId);
  const updateLink = useUpdateLink(props.link, orderbyQuery, tagsQuery);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CommentFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (formData: CommentFormData) => {
    if (!user) {
      return;
    }
    const commentRef = db.collection(dbKeys.comments(linkId)).doc();

    const comment = formatComment(formData, user);
    addLinkComment.mutate({ commentRef, comment });

    updateLink.mutate({ commentCount: props.link.commentCount + 1 });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextArea
        id="link-comment"
        className="mb-6"
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
