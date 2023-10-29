import TagsCombobox from '@/components/TagsCombobox';
import { updateLinkSchema } from '@/components/modals/UpdateLinkModal/schemas';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { GetLinksReturn } from '@/data/link/get-links';
import { useUpdateLink } from '@/data/link/use-update-link';
import { GetTagsReturn } from '@/data/tag/get-tags';
import { singleToArray } from '@/lib/utils';
import { useProfile } from '@/store/profile.store';
import { formatError } from '@/utils/format-string';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';

interface LinkFormData {
  url: string;
  title: string;
  tags: GetTagsReturn;
}

interface AddLinkFormProps {
  closeModal: () => void;
  linkToUpdate: GetLinksReturn['data'][0];
}

const UpdateLinkForm: React.FC<AddLinkFormProps> = (props) => {
  const profile = useProfile()[0];
  const { destructiveToast } = useToast();

  const form = useForm<LinkFormData>({
    resolver: zodResolver(updateLinkSchema),
    defaultValues: {
      url: props.linkToUpdate.url,
      title: props.linkToUpdate.description,
      tags: singleToArray(props.linkToUpdate.tags),
    },
  });

  const updateLink = useUpdateLink();

  const handleSubmit = form.handleSubmit(async (formData: LinkFormData) => {
    try {
      if (!profile) {
        throw new Error('You must be login');
      }

      await updateLink.mutateAsync({
        linkId: props.linkToUpdate.id,
        linkToUpdate: {
          url: formData.url,
          description: formData.title,
          updatedAt: new Date().toISOString(),
        },
        tags: singleToArray(formData.tags),
      });

      // Do not setLoading(false) because addLink will unmount this component (Modal).
      props.closeModal();
    } catch (err) {
      destructiveToast({ description: formatError(err as Error) });
      console.error(err);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder="URL of your link" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="A title for your link" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TagsCombobox selectedTags={field.value} setSelectedTags={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button variant="secondary" type="button" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button variant="default" type="submit" isLoading={updateLink.isPending}>
            Update
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default UpdateLinkForm;
