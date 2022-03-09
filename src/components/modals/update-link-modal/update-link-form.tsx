import { useUpdateLink } from '@api/link/use-update-link';
import { useTags } from '@api/tag/use-tags';
import Button from '@components/elements/button';
import TextInput from '@components/elements/text-input';
import TagsListBox from '@components/tag/tags-list-box';
import { yupResolver } from '@hookform/resolvers/yup';
import { useFetchHtmlText } from '@hooks/use-fetch-html-text';
import { Link } from '@models/link';
import { Tag } from '@models/tag';
import { useProfile } from '@store/profile.store';
import { updateLinkSchema } from '@utils/form-schemas';
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
  linkToUpdate: Link;
}

const UpdateLinkForm: React.FC<AddLinkFormProps> = (props) => {
  const [profile] = useProfile();

  const { data: tags } = useTags({ refetchOnMount: false });

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
      tagsIds: props.linkToUpdate.tags?.map((tag) => tag.id),
    },
  });
  const selectedTagsIds = watch('tagsIds');

  const updateLink = useUpdateLink();

  const url = watch('url');
  const { htmlText: title, loading: htmlTextLoading } = useFetchHtmlText(url, false);
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

        const updatedTags: Tag[] = [];
        selectedTagsIds.forEach((selectedTagId) => {
          const foundTag = tags?.find((tag) => tag.id === selectedTagId);
          if (foundTag) {
            updatedTags.push(foundTag);
          }
        });

        await updateLink.mutateAsync({
          linkId: props.linkToUpdate.id,
          linkToAdd: {
            url: formData.url,
            description: formData.title,
            updatedAt: new Date(),
          },
          tags: updatedTags,
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
      <div className="flex justify-end space-x-4">
        <Button text="Reset" theme="gray" onClick={reset} />
        <Button theme="secondary" text="Update" type="submit" loading={updateLink.isLoading} />
      </div>
    </form>
  );
};

export default UpdateLinkForm;
