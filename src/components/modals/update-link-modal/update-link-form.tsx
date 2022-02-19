import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useCallback } from 'react';
import { FieldError, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import Button from '@components/elements/button';
import TextInput from '@components/elements/text-input';
import TagsListBox from '@components/tag/tags-list-box';

import { useAuth } from '@api/auth/useAuth';

import { useCategories } from '@hooks/category/use-categories';
import { useLinksQueryKey } from '@hooks/link/use-links-query-key';
import { useUpdateLink } from '@hooks/link/use-update-link';
import { useFetchHtmlText } from '@hooks/use-fetch-html-text';

import { Link, LinkFormData } from '@data-types/link.type';

import { updateLinkSchema } from '@utils/form-schemas';
import { formatUpdatedLink } from '@utils/format-link';
import { formatError } from '@utils/format-string';
import { Document } from '@utils/shared-types';

interface AddLinkFormProps {
  closeModal: () => void;
  linkToUpdate: Document<Link>;
}

const UpdateLinkForm: React.FC<AddLinkFormProps> = (props) => {
  const { user } = useAuth();

  const linksQueryKey = useLinksQueryKey(user?.id as string);

  const { data: tags } = useCategories({ refetchOnMount: false });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LinkFormData>({
    resolver: yupResolver(updateLinkSchema),
    defaultValues: {
      url: props.linkToUpdate.url,
      title: props.linkToUpdate.description,
    },
  });

  useEffect(() => {
    setValue('tags', props.linkToUpdate.categories);
  }, []);

  const selectedTags = watch('tags', []);

  const updateLink = useUpdateLink(props.linkToUpdate, linksQueryKey);

  const url = watch('url');
  const { htmlText: title, loading: htmlTextLoading } = useFetchHtmlText(url, false);
  useEffect(() => {
    if (title) {
      setValue('title', title, { shouldValidate: true });
    }
  }, [title]);

  const onSubmit = useCallback(
    (formData: LinkFormData) => {
      try {
        if (!user) {
          throw new Error('You must be login');
        }

        selectedTags.forEach((selectedTag) => {
          const foundTag = tags?.find(
            (tag) => tag.name.toLocaleLowerCase() === selectedTag.toLocaleLowerCase()
          );
          if (!foundTag) {
            throw new Error(`The tag ${selectedTag} does not exist`);
          }
        });
        const updatedLink = formatUpdatedLink(formData);
        updateLink.mutate(updatedLink);

        // Do not setLoading(false) because addLink will unmount this component (Modal).
        props.closeModal();
      } catch (err) {
        toast.error(formatError(err as Error));
        console.error(err);
      }
    },
    [user, tags, selectedTags]
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
      <TagsListBox
        tags={tags}
        selectedTags={selectedTags}
        setSelectedTags={(tags) => setValue('tags', tags, { shouldValidate: true })}
        className="mb-8"
        label="tags (min 1, max 4)"
        errorText={(errors.tags as unknown as FieldError)?.message}
      />
      <div className="flex justify-end space-x-4">
        <Button
          text="Reset"
          theme="gray"
          onClick={() => {
            setValue('url', props.linkToUpdate.url);
            setValue('title', props.linkToUpdate.description);
            setValue('tags', props.linkToUpdate.categories);
          }}
        />
        <Button theme="secondary" text="Update" type="submit" />
      </div>
    </form>
  );
};

export default UpdateLinkForm;
