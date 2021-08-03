import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

import Button from '@components/elements/button';
import TextArea from '@components/elements/textarea';

import { useAuth } from '@hooks/auth/useAuth';
import { useUpdateLinkComment } from '@hooks/link/use-update-link-comment';

import { Comment, CommentFormData } from '@data-types/comment.type';
import { Link } from '@data-types/link.type';

import { addCommentSchema, commentMaxLength } from '@utils/form-schemas';
import { formatError } from '@utils/format-string';
import { Document } from '@utils/shared-types';

interface UpdateCommentFormProps {
  commentToUpdate: Document<Comment>;
  link: Document<Link>;
  closeUpdate: () => void;
}

const UpdateCommentForm: React.FC<UpdateCommentFormProps> = (props) => {
  const { user } = useAuth();
  const linkId = props.link.id as string;

  const [showPreview, setShowPreview] = useState(false);

  const updateLinkComment = useUpdateLinkComment(props.link, props.commentToUpdate);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CommentFormData>({
    resolver: yupResolver(addCommentSchema),
    defaultValues: {
      text: props.commentToUpdate.text,
    },
  });

  const commentText = watch('text', props.commentToUpdate.text) ?? '';

  const onSubmit = useCallback(
    (formData: CommentFormData) => {
      try {
        if (!user) {
          throw new Error('You must be login');
        }

        if (formData.text !== props.commentToUpdate.text) {
          updateLinkComment.mutate(formData);
        }
        props.closeUpdate();
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
        <ReactMarkdown linkTarget="_blank" className="prose prose-sm">
          {commentText}
        </ReactMarkdown>
      ) : (
        <>
          <TextArea
            id="link-comment"
            placeholder="Leave your comment here..."
            {...register('text')}
            errorText={errors.text?.message}
            maxLength={commentMaxLength}
            textareaClassName="h-24"
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
        <Button theme="secondary" text="Update" type="submit" />
      </div>
    </form>
  );
};

export default UpdateCommentForm;
