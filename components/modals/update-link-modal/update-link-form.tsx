import { GetLinksReturn } from '@api/link/get-links';
import Button from '@components/elements/button';
import TextInput from '@components/elements/text-input';
import { useSupabase } from '@components/SupabaseAuthProvider';
import TagsCombobox from '@components/tag/tags-combobox';
import { yupResolver } from '@hookform/resolvers/yup';
import { updateLinkSchema } from '@utils/form-schemas';
import { formatError } from '@utils/format-string';
import { singleToArray } from '@utils/single-to-array';
import { useUpdateLink } from 'api/link/use-update-link';
import { GetTagsReturn } from 'api/tag/use-tags';
import React, { useCallback } from 'react';
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
  initialFocusButtonRef?: React.MutableRefObject<HTMLButtonElement | null>;
}

const UpdateLinkForm: React.FC<AddLinkFormProps> = (props) => {
  const { profile } = useSupabase();

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
      tags: singleToArray(props.linkToUpdate.tags),
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
          tags: singleToArray(formData.tags),
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
        <Button
          ref={props.initialFocusButtonRef}
          theme="secondary"
          text="Update"
          type="submit"
          loading={updateLink.isLoading}
        />
      </div>
    </form>
  );
};

export default UpdateLinkForm;
