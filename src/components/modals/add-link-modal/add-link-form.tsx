import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useCallback } from 'react';
import { FieldError, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import Button from '@components/elements/button';
import TextInput from '@components/elements/text-input';
import TagsListBox from '@components/tag/tags-list-box';

import { useAuth } from '@hooks/auth/useAuth';
import { useCategories } from '@hooks/category/use-categories';
import { dbKeys } from '@hooks/link/db-keys';
import { useAddLink } from '@hooks/link/use-add-link';
import { useLinksQueryKey } from '@hooks/link/use-links-query-key';
import { useFetchHtmlText } from '@hooks/use-fetch-html-text';

import { LinkFormData } from '@data-types/link.type';

import { formatLink } from '@utils/format-link';
import { formatError, validUrlRegex } from '@utils/format-string';
import { db } from '@utils/init-firebase';

const schema = yup.object().shape({
  url: yup
    .string()
    .required('Url is required')
    .matches(validUrlRegex, { message: 'Url must be a valid url' })
    .max(255),
  title: yup.string().required('Title is required').max(255),
  tags: yup
    .array(yup.string())
    .required('At least 1 tag required')
    .min(1, 'At least 1 tag required')
    .max(4, 'No more than 4 tags'),
});

interface AddLinkFormProps {
  closeModal: () => void;
}

const AddLinkForm: React.FC<AddLinkFormProps> = (props) => {
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
    resolver: yupResolver(schema),
  });
  const selectedTags = watch('tags', []);
  const addLink = useAddLink(linksQueryKey);

  const url = watch('url', '');
  const { htmlText: title, loading: htmlTextLoading } = useFetchHtmlText(url);
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

        const link = formatLink(formData, user);
        addLink.mutate({ linkRef: db.collection(dbKeys.links).doc(), link });

        // Do not setLoading(false) because addLink will unmount this component (Modal).
        props.closeModal();
      } catch (err) {
        toast.error(formatError(err));
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
      <div className="flex justify-end">
        <Button theme="secondary" text="Create" type="submit" />
      </div>
    </form>
  );
};

export default AddLinkForm;
