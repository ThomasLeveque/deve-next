import TagsCombobox from '@/components/TagsCombobox';
import TextInput from '@/components/TextInput';
import { updateLinkSchema } from '@/components/modals/UpdateLinkModal/schemas';
import { Button } from '@/components/ui/Button';
import { GetLinksReturn } from '@/data/link/get-links';
import { useUpdateLink } from '@/data/link/use-update-link';
import { GetTagsReturn } from '@/data/tag/get-tags';
import { singleToArray } from '@/lib/utils';
import { useProfile } from '@/store/profile.store';
import { formatError } from '@/utils/format-string';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { FieldError, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<LinkFormData>({
    resolver: zodResolver(updateLinkSchema),
    defaultValues: {
      url: props.linkToUpdate.url,
      title: props.linkToUpdate.description,
      tags: singleToArray(props.linkToUpdate.tags),
    },
  });

  const updateLink = useUpdateLink();

  async function onSubmit(formData: LinkFormData) {
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
      <div className="flex justify-end space-x-4">
        <Button variant="link" type="button" onClick={() => reset()}>
          Reset
        </Button>
        <Button variant="default" type="submit" isLoading={updateLink.isPending}>
          Update
        </Button>
      </div>
    </form>
  );
};

export default UpdateLinkForm;
