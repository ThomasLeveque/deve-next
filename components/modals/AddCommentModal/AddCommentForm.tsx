'use client';

import { addCommentSchema, commentMaxLength } from '@/components/modals/AddCommentModal/schemas';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAddLinkComment } from '@/data/comment/use-add-comment';

import { FetchProfileReturn } from '@/lib/supabase/queries/fetch-profile';
import { formatError } from '@/utils/format-string';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import CommentItem from './CommentItem';

interface CommentFormData {
  text: string;
}

interface AddCommentFormProps {
  linkId: number;
  profile: NonNullable<FetchProfileReturn>;
}

function AddCommentForm({ linkId, profile }: AddCommentFormProps) {
  const { destructiveToast } = useToast();

  const [showPreview, setShowPreview] = useState(false);

  const addLinkComment = useAddLinkComment(linkId);

  const form = useForm<CommentFormData>({
    resolver: zodResolver(addCommentSchema),
    defaultValues: {
      text: '',
    },
  });

  const disabledPreview = form.watch('text').length === 0;

  const handleSubmit = form.handleSubmit(async (formData: CommentFormData) => {
    try {
      await addLinkComment.mutateAsync({
        text: formData.text,
        linkId,
        userId: profile.id,
      });

      form.reset();
    } catch (err) {
      destructiveToast({ description: formatError(err as Error) });
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
                    profile={profile}
                    comment={{
                      id: -1,
                      text: field.value,
                      userId: profile?.id,
                      linkId: linkId,
                      user: profile,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    }}
                    isPreview={true}
                    linkId={linkId}
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
}

export default AddCommentForm;
