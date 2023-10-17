'use client';

import TextArea from '@/components/Textarea';
import { addCommentSchema, commentMaxLength } from '@/components/modals/AddCommentModal/schemas';
import { Button } from '@/components/ui/ButtonToto';
import { DialogFooter } from '@/components/ui/Dialog';
import { useAddLinkComment } from '@/data/comment/use-add-comment';
import { useProfile } from '@/store/profile.store';
import { formatError } from '@/utils/format-string';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import CommentItem from './CommentItem';

interface CommentFormData {
  text: string;
}

interface AddCommentFormProps {
  linkId: number;
}

const AddCommentForm: React.FC<AddCommentFormProps> = (props) => {
  const profile = useProfile()[0];

  const [showPreview, setShowPreview] = useState(false);

  const addLinkComment = useAddLinkComment(props.linkId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CommentFormData>({
    resolver: zodResolver(addCommentSchema),
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
              user: [profile],
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
          <p className="ml-1 mt-3 space-x-1 text-xs">
            <span>Characters left:</span>
            <span className="font-bold">{commentMaxLength - commentText.length}</span>
          </p>
        </>
      )}

      <DialogFooter className="mt-8">
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
        <Button variant="default" type="submit" isLoading={addLinkComment.isPending}>
          Add
        </Button>
      </DialogFooter>
    </form>
  );
};

export default AddCommentForm;
