import { useUpdateLink } from '@api/link/use-update-link';
import Button from '@components/elements/button';
import TextInput from '@components/elements/text-input';
import TagsCombobox from '@components/tag/tags-combobox';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from '@models/link';
import { Tag } from '@models/tag';
import { useProfile } from '@store/profile.store';
import { updateLinkSchema } from '@utils/form-schemas';
import { formatError } from '@utils/format-string';
import React, { useCallback } from 'react';
import { FieldError, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface LinkFormData {
  url: string;
  title: string;
  tags: Omit<Tag, 'links'>[];
}

interface AddLinkFormProps {
  closeModal: () => void;
  linkToUpdate: Link;
}

const UpdateLinkForm: React.FC<AddLinkFormProps> = (props) => {
  const [profile] = useProfile();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<LinkFormData>({
    resolver: yupResolver(updateLinkSchema),
    defaultValues: {
      url: props.linkToUpdate.url,
      title: props.linkToUpdate.description,
      tags: props.linkToUpdate.tags,
    },
  });

  const updateLink = useUpdateLink();

  const onSubmit = useCallback(
    async (formData: LinkFormData) => {
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
          tags: formData.tags,
        });

        // Do not setLoading(false) because addLink will unmount this component (Modal).
        props.closeModal();
      } catch (err) {
        toast.error(formatError(err as Error));
        console.error(err);
      }
    },
    [profile]
  );

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
        <Button text="Reset" theme="gray" onClick={() => reset()} />
        <Button theme="secondary" text="Update" type="submit" loading={updateLink.isLoading} />
      </div>
    </form>
  );
};

export default UpdateLinkForm;
