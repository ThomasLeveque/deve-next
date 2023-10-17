import TagsCombobox from '@/components/TagsCombobox';
import TextInput from '@/components/TextInput';
import { addLinkSchema } from '@/components/modals/AddLinkModal/schemas';
import { Button } from '@/components/ui/Button';
import { DialogClose, DialogFooter } from '@/components/ui/Dialog';
import { useAddLink } from '@/data/link/use-add-link';
import { GetTagsReturn } from '@/data/tag/get-tags';
import { useProfile } from '@/store/profile.store';
import { formatError } from '@/utils/format-string';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldError, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LinkFormData>({
    resolver: zodResolver(addLinkSchema),
  });

  async function onSubmit(formData: LinkFormData) {
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
      toast.error(formatError(err as Error));
      console.error(err);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        wrapperClassName="mb-6"
        id="url"
        label="URL"
        placeholder="URL of your link"
        {...register('url')}
        errorText={errors.url?.message}
      />
      <TextInput
        wrapperClassName="mb-6"
        id="title"
        label="Title"
        placeholder="A title for your link"
        {...register('title')}
        errorText={errors.title?.message}
      />
      <TagsCombobox
        selectedTags={watch('tags')}
        setSelectedTags={(tags) => {
          setValue('tags', tags, { shouldValidate: true });
        }}
        className="mb-8"
        errorText={(errors.tags as unknown as FieldError)?.message}
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
  );
}

export default AddLinkForm;