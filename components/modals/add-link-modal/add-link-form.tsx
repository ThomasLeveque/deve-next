import Button from '@components/elements/button';
import TextInput from '@components/elements/text-input';
import { useSupabase } from '@components/SupabaseAuthProvider';
import TagsCombobox from '@components/tag/tags-combobox';
import { useAddLink } from '@data/link/use-add-link';
import { GetTagsReturn } from '@data/tag/use-tags';
import { yupResolver } from '@hookform/resolvers/yup';
import { addLinkSchema } from '@utils/form-schemas';
import { formatError } from '@utils/format-string';
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
  initialFocusButtonRef?: React.MutableRefObject<HTMLButtonElement | null>;
}

const AddLinkForm: React.FC<AddLinkFormProps> = (props) => {
  const { profile } = useSupabase();
  const addLink = useAddLink();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LinkFormData>({
    resolver: yupResolver(addLinkSchema),
  });

  const onSubmit = useCallback(
    async (formData: LinkFormData) => {
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
      <div className="flex justify-end">
        <Button
          ref={props.initialFocusButtonRef}
          theme="secondary"
          text="Create"
          type="submit"
          loading={addLink.isLoading}
        />
      </div>
    </form>
  );
};

export default AddLinkForm;
