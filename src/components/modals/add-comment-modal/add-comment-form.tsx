import { useAddLinkComment } from '@api/comment/use-add-comment';
import Button from '@components/elements/button';
import TextArea from '@components/elements/textarea';
import { yupResolver } from '@hookform/resolvers/yup';
import { useProfile } from '@store/profile.store';
import { addCommentSchema, commentMaxLength } from '@utils/form-schemas';
import { formatError } from '@utils/format-string';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import CommentItem from './comment-item';

interface CommentFormData {
  text: string;
}

interface AddCommentFormProps {
  linkId: number;
}

const AddCommentForm: React.FC<AddCommentFormProps> = (props) => {
  const [profile] = useProfile();

  const [showPreview, setShowPreview] = useState(false);

  const addLinkComment = useAddLinkComment(props.linkId);

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
    async (formData: CommentFormData) => {
      try {
        if (!profile) {
          throw new Error('You must be login');
        }

        await addLinkComment.mutateAsync({
          text: formData.text,
          linkId: props.linkId,
          userId: profile.id,
        });

        reset();
      } catch (err) {
        toast.error(formatError(err as Error));
        console.error(err);
      }
      setShowPreview(false);
    },
    [profile, props.linkId]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {showPreview && profile ? (
        <ul>
          <CommentItem
            comment={{
              id: -1,
              text: commentText,
              userId: profile?.id,
              linkId: props.linkId,
              user: profile,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }}
            isPreview={true}
            linkId={props.linkId}
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
            wrapperClassName="h-32"
            className="h-full"
          />
          <p className="mt-3 ml-1 space-x-1 text-xs">
            <span>Characters left:</span>
            <span className="font-poppins-bold">{commentMaxLength - commentText.length}</span>
          </p>
        </>
      )}

      <div className="mt-8 flex justify-end space-x-4">
        <Button
          text={showPreview ? 'Edit' : 'Preview'}
          theme="gray"
          onClick={() => {
            if (commentText.length > 0) {
              setShowPreview((prevShowPreview) => !prevShowPreview);
            }
          }}
        />
        <Button theme="secondary" text="Add" type="submit" loading={addLinkComment.isLoading} />
      </div>
    </form>
  );
};

export default AddCommentForm;
