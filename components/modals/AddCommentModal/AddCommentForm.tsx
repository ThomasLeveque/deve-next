'use client';

import { addCommentSchema, commentMaxLength } from '@/components/modals/AddCommentModal/schemas';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useAddLinkComment } from '@/data/comment/use-add-comment';
import { useProfile } from '@/store/profile.store';
import { formatError } from '@/utils/format-string';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
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

  const form = useForm<CommentFormData>({
    resolver: zodResolver(addCommentSchema),
    defaultValues: {
      text: '',
    },
  });

  const disabledPreview = form.watch('text').length === 0;

  const handleSubmit = form.handleSubmit(async (formData: CommentFormData) => {
    try {
      if (!profile) {
        throw new Error('You must be login');
      }

      await addLinkComment.mutateAsync({
        text: formData.text,
        linkId: props.linkId,
        userId: profile.id,
      });

      form.reset();
    } catch (err) {
      toast.error(formatError(err as Error));
      console.error(err);
    }
    setShowPreview(false);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              {showPreview && profile ? (
                <ul>
                  <CommentItem
                    comment={{
                      id: -1,
                      text: field.value,
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
                  <FormControl>
                    <Textarea
                      placeholder="Leave your comment here..."
                      {...field}
                      maxLength={commentMaxLength}
                      rows={5}
                    />
                  </FormControl>
                  <FormDescription>
                    <span>Characters left: </span>
                    <span className="font-bold">{commentMaxLength - field.value.length}</span>
                  </FormDescription>
                  <FormMessage />
                </>
              )}
            </FormItem>
          )}
        />

        <DialogFooter className="mt-8">
          <Button
            variant="secondary"
            type="button"
            disabled={disabledPreview}
            onClick={() => {
              if (!disabledPreview) {
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
    </Form>
  );
};

export default AddCommentForm;
