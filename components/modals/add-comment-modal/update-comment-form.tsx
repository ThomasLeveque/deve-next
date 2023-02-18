import Button from '@components/elements/button';
import TextArea from '@components/elements/textarea';
import { useSupabase } from '@components/SupabaseAuthProvider';
import { yupResolver } from '@hookform/resolvers/yup';
import { addCommentSchema, commentMaxLength } from '@utils/form-schemas';
import { formatError } from '@utils/format-string';
import { GetCommentsReturn } from 'api/comment/use-comments';
import { useUpdateLinkComment } from 'api/comment/use-update-comment';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

interface CommentFormData {
  text: string;
}

interface UpdateCommentFormProps {
  commentToUpdate: GetCommentsReturn['data'][0];
  linkId: number;
  closeUpdate: () => void;
}

const UpdateCommentForm: React.FC<UpdateCommentFormProps> = (props) => {
  const { profile } = useSupabase();

  const [showPreview, setShowPreview] = useState(false);

  const updateLinkComment = useUpdateLinkComment(props.linkId);

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
    async (formData: CommentFormData) => {
      try {
        if (!profile) {
          throw new Error('You must be login');
        }

        if (formData.text !== props.commentToUpdate.text) {
          await updateLinkComment.mutateAsync({
            commentId: props.commentToUpdate.id,
            commentToUpdate: {
              text: formData.text,
              updatedAt: new Date().toISOString(),
            },
          });
        }
        props.closeUpdate();
      } catch (err) {
        toast.error(formatError(err as Error));
        console.error(err);
      }
      setShowPreview(false);
    },
    [profile, props.linkId, props.commentToUpdate.text]
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
            wrapperClassName="h-24"
            className="h-full"
          />
          <p className="mt-3 ml-1 text-xs">
            Characters left: <span className="font-bold">{commentMaxLength - commentText.length}</span>
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
        <Button theme="secondary" text="Update" type="submit" loading={updateLinkComment.isLoading} />
      </div>
    </form>
  );
};

export default UpdateCommentForm;
