import { useAddLink } from '@api/link/use-add-link';
import { useTags } from '@api/tag/use-tags';
import Button from '@components/elements/button';
import TextInput from '@components/elements/text-input';
import TagsListBox from '@components/tag/tags-list-box';
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
  tagsIds: number[];
}

interface AddLinkFormProps {
  closeModal: () => void;
}

const AddLinkForm: React.FC<AddLinkFormProps> = (props) => {
  const [profile] = useProfile();

  const { data: tags } = useTags({ refetchOnMount: false });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LinkFormData>({
    resolver: yupResolver(addLinkSchema),
  });
  const selectedTagsIds = watch('tagsIds', []);
  const addLink = useAddLink();

  const url = watch('url', '');
  const { htmlText: title, loading: htmlTextLoading } = useFetchHtmlText(url);
  useEffect(() => {
    if (title) {
      setValue('title', title, { shouldValidate: true });
    }
  }, [title]);

  const onSubmit = useCallback(
    async (formData: LinkFormData) => {
      try {
        if (!profile) {
          throw new Error('You must be login');
        }

        const selectedTags: Tag[] = [];
        selectedTagsIds.forEach((selectedTagId) => {
          const foundTag = tags?.find((tag) => tag.id === selectedTagId);
          if (foundTag) {
            selectedTags.push(foundTag);
          }
        });
        await addLink.mutateAsync({
          linkToAdd: {
            url: formData.url,
            description: formData.title,
            userId: profile.id,
          },
          tags: selectedTags,
        });

        // Do not setLoading(false) because addLink will unmount this component (Modal).
        props.closeModal();
      } catch (err) {
        toast.error(formatError(err as Error));
        console.error(err);
      }
    },
    [profile, tags, selectedTagsIds]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        className="mb-6"
        id="url"
        label="URL"
        placeholder="URL of your link"
        {...register('url')}
        errorText={errors.url?.message}
      />
      <TextInput
        className="mb-6"
        id="title"
        label="Title"
        placeholder={htmlTextLoading ? 'Looking for title...' : 'A title for your link'}
        {...register('title')}
        errorText={errors.title?.message}
      />
      {tags && (
        <TagsListBox
          tags={tags}
          selectedTags={selectedTagsIds}
          setSelectedTags={(tagsIds) => setValue('tagsIds', tagsIds, { shouldValidate: true })}
          className="mb-8"
          label="tags (min 1, max 4)"
          errorText={(errors.tagsIds as unknown as FieldError)?.message}
        />
      )}
      <div className="flex justify-end">
        <Button theme="secondary" text="Create" type="submit" loading={addLink.isLoading} />
      </div>
    </form>
  );
};

export default AddLinkForm;
