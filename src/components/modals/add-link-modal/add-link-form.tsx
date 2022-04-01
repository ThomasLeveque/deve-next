import { useAddLink } from '@api/link/use-add-link';
import Button from '@components/elements/button';
import TextInput from '@components/elements/text-input';
import TagsCombobox from '@components/tag/tags-combobox';
import { yupResolver } from '@hookform/resolvers/yup';
import { useFetchHtmlText } from '@hooks/use-fetch-html-text';
import { Tag } from '@models/tag';
import { useProfile } from '@store/profile.store';
import { addLinkSchema } from '@utils/form-schemas';
import { formatError } from '@utils/format-string';
import React, { useCallback, useEffect } from 'react';
import { FieldError, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface LinkFormData {
  url: string;
  title: string;
  tags: Omit<Tag, 'links'>[];
}

interface AddLinkFormProps {
  closeModal: () => void;
}

const AddLinkForm: React.FC<AddLinkFormProps> = (props) => {
  const [profile] = useProfile();
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

  const url = watch('url', '');
  const { htmlText: title, loading: htmlTextLoading } = useFetchHtmlText(url);
  useEffect(() => {
    if (title) {
      setValue('title', title, { shouldValidate: true });
    }
  }, [title, setValue]);

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
        placeholder={htmlTextLoading ? 'Looking for title...' : 'A title for your link'}
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
        <Button theme="secondary" text="Create" type="submit" loading={addLink.isLoading} />
      </div>
    </form>
  );
};

export default AddLinkForm;
