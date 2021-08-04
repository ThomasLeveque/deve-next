import { yupResolver } from '@hookform/resolvers/yup';
import { doc, collection } from 'firebase/firestore/lite';
import React, { useCallback, useState } from 'react';
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
import { User } from '@data-types/user.type';

import { addCommentSchema, commentMaxLength } from '@utils/form-schemas';
import { formatComment } from '@utils/format-comment';
import { formatError } from '@utils/format-string';
import { db } from '@utils/init-firebase';
import { Document } from '@utils/shared-types';

import CommentItem from './comment-item';

interface AddCommentFormProps {
  link: Document<Link>;
}

const AddCommentForm: React.FC<AddCommentFormProps> = (props) => {
  const { user } = useAuth();
  const linkId = props.link.id as string;

  const [showPreview, setShowPreview] = useState(false);

  const linksQueryKey = useLinksQueryKey(user?.id as string);

  const addLinkComment = useAddLinkComment(props.link, linksQueryKey);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CommentFormData>({
    resolver: yupResolver(addCommentSchema),
  });

  const commentText = watch('text', '') ?? '';

  const onSubmit = useCallback(
    (formData: CommentFormData) => {
      try {
        if (!user) {
          throw new Error('You must be login');
        }
        const commentRef = doc(collection(db, dbKeys.comments(linkId)));

        const comment = formatComment(formData, user);
        addLinkComment.mutate({ commentRef, comment });

        reset();
      } catch (err) {
        toast.error(formatError(err));
        console.error(err);
      }
      setShowPreview(false);
    },
    [user, linkId]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {showPreview ? (
        <ul>
          <CommentItem
            comment={formatComment({ text: commentText }, user as Document<User>)}
            isPreview={true}
            link={props.link}
          />
        </ul>
      ) : (
        <>
          <TextArea
            id="link-comment"
            placeholder="Leave your comment here..."
            {...register('text')}
            errorText={errors.text?.message}
            maxLength={commentMaxLength}
            textareaClassName="h-32"
          />
          <p className="mt-3 ml-1 text-xs">
            Characters left:{' '}
            <span className="font-poppins-bold">{commentMaxLength - commentText.length}</span>
          </p>
        </>
      )}

      <div className="flex justify-end space-x-4 mt-8">
        <Button
          text={showPreview ? 'Edit' : 'Preview'}
          theme="gray"
          onClick={() => {
            if (commentText.length > 0) {
              setShowPreview((prevShowPreview) => !prevShowPreview);
            }
          }}
        />
        <Button theme="secondary" text="Add" type="submit" />
      </div>
    </form>
  );
};

export default AddCommentForm;
