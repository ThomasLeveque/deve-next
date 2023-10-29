import TagsCombobox from '@/components/TagsCombobox';
import { addLinkSchema } from '@/components/modals/AddLinkModal/schemas';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAddLink } from '@/data/link/use-add-link';
import { GetTagsReturn } from '@/data/tag/get-tags';
import { useProfile } from '@/store/profile.store';
import { formatError } from '@/utils/format-string';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

interface LinkFormData {
  url: string;
  title: string;
  tags: GetTagsReturn;
}

interface AddLinkFormProps {
  closeModal: () => void;
}

function AddLinkForm({ closeModal }: AddLinkFormProps) {
  const profile = useProfile()[0];
  const addLink = useAddLink();
  const { destructiveToast } = useToast();

  const form = useForm<LinkFormData>({
    resolver: zodResolver(addLinkSchema),
  });

  const handleSubmit = form.handleSubmit(async (formData: LinkFormData) => {
    try {
      if (!profile) {
        throw new Error('You must be login');
      }

      await addLink.mutateAsync({
        linkToAdd: {
          url: formData.url,
          description: formData.title,
          userId: profile.id,
        },
        tags: formData.tags,
      });

      // Do not setLoading(false) because addLink will unmount this component (Modal).
      closeModal();
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
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button type="submit" isLoading={addLink.isPending}>
            Create
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default AddLinkForm;
