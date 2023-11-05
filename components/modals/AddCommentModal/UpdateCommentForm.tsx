import { addCommentSchema, commentMaxLength } from '@/components/modals/AddCommentModal/schemas';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { GetCommentsReturn } from '@/data/comment/use-comments';
import { useUpdateLinkComment } from '@/data/comment/use-update-comment';
import { FetchProfileReturn } from '@/lib/supabase/queries/fetch-profile';
import { formatError } from '@/utils/format-string';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';

interface CommentFormData {
  text: string;
}

interface UpdateCommentFormProps {
  commentToUpdate: GetCommentsReturn['data'][0];
  linkId: number;
  closeUpdate: () => void;
  profile: NonNullable<FetchProfileReturn>;
}

function UpdateCommentForm({ commentToUpdate, linkId, closeUpdate, profile }: UpdateCommentFormProps) {
  const { destructiveToast } = useToast();

  const [showPreview, setShowPreview] = useState(false);

  const updateLinkComment = useUpdateLinkComment(linkId);

  const form = useForm<CommentFormData>({
    resolver: zodResolver(addCommentSchema),
    defaultValues: {
      text: commentToUpdate.text,
    },
  });

  const disabledPreview = form.watch('text').length === 0;

  const handleSubmit = form.handleSubmit(async (formData: CommentFormData) => {
    try {
      if (!profile) {
        throw new Error('You must be login');
      }

      if (formData.text !== commentToUpdate.text) {
        await updateLinkComment.mutateAsync({
          commentId: commentToUpdate.id,
          commentToUpdate: {
            text: formData.text,
            updatedAt: new Date().toISOString(),
          },
        });
      }
      closeUpdate();
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
              {showPreview ? (
                <ReactMarkdown className="prose-sm prose">{field.value}</ReactMarkdown>
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

        <div className="mt-8 flex justify-end space-x-4">
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
          <Button variant="default" type="submit">
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default UpdateCommentForm;
