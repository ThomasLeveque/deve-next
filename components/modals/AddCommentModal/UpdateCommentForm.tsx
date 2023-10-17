import TextArea from '@/components/Textarea';
import { addCommentSchema, commentMaxLength } from '@/components/modals/AddCommentModal/schemas';
import { Button } from '@/components/ui/button';
import { GetCommentsReturn } from '@/data/comment/use-comments';
import { useUpdateLinkComment } from '@/data/comment/use-update-comment';
import { useProfile } from '@/store/profile.store';
import { formatError } from '@/utils/format-string';
import { zodResolver } from '@hookform/resolvers/zod';
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
  const profile = useProfile()[0];

  const [showPreview, setShowPreview] = useState(false);

  const updateLinkComment = useUpdateLinkComment(props.linkId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CommentFormData>({
    resolver: zodResolver(addCommentSchema),
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
        <ReactMarkdown className="prose-sm prose">{commentText}</ReactMarkdown>
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
          <p className="ml-1 mt-3 text-xs">
            Characters left: <span className="font-bold">{commentMaxLength - commentText.length}</span>
          </p>
        </>
      )}

      <div className="mt-8 flex justify-end space-x-4">
        <Button
          variant="secondary"
          type="button"
          onClick={() => {
            if (commentText.length > 0) {
              setShowPreview((prevShowPreview) => !prevShowPreview);
            }
          }}
        >
          {showPreview ? 'Edit' : 'Preview'}
        </Button>
        <Button variant="default" type="submit">
          Update
        </Button>
      </div>
    </form>
  );
};

export default UpdateCommentForm;
