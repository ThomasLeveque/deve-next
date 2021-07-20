import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState, useEffect } from 'react';
import { FieldError, useForm } from 'react-hook-form';
import * as yup from 'yup';

import Button from '@components/elements/button';
import TextInput from '@components/elements/text-input';
import TagsListBox from '@components/tag/tags-list-box';

import { useAuth } from '@hooks/auth/useAuth';
import { useCategories } from '@hooks/category/use-categories';
import { useUpdateCategory } from '@hooks/category/use-update-category';
import { dbKeys } from '@hooks/link/db-keys';
import { useAddLink } from '@hooks/link/use-add-link';
import { useFetchHtmlText } from '@hooks/use-fetch-html-text';
import { useQueryString } from '@hooks/use-query-string';

import { LinkFormData } from '@data-types/link.type';

import { formatLink } from '@utils/format-link';
import { db } from '@utils/init-firebase';

const schema = yup.object().shape({
  url: yup.string().required('An url is required').max(255),
  title: yup.string().required('A title is required').max(255),
  tags: yup
    .array(yup.string())
    .required('At least on tag required')
    .min(1, 'At least 1 tag required')
    .max(4, 'No more than 4 tags'),
});

interface AddLinkFormProps {
  closeModal: () => void;
}

const AddLinkForm: React.FC<AddLinkFormProps> = (props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { orderbyQuery, tagsQuery } = useQueryString();
  const { user } = useAuth();
  const addLink = useAddLink(orderbyQuery, tagsQuery);

  const { data: tags } = useCategories();
  const updateCategory = useUpdateCategory();

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

  const url = watch('url', '');
  const { htmlText: title, loading: htmlTextLoading } = useFetchHtmlText(url);
  useEffect(() => {
    setValue('title', title);
  }, [title]);

  const onSubmit = async (formData: LinkFormData) => {
    if (!user) {
      return;
    }
    setLoading(true);

    selectedTags.forEach((selectedTag) => {
      const prevTag = tags?.find(
        (tag) => tag.name.toLocaleLowerCase() === selectedTag.toLocaleLowerCase()
      );

      if (prevTag) {
        updateCategory.mutate({
          prevCategory: prevTag,
          categoryToUpdate: { count: prevTag.count + 1 },
        });
      }
    });

    // Do not setLoading(false) because addLink will unmount this component (Modal).
    const link = formatLink(formData, user);
    addLink.mutate({ linkRef: db.collection(dbKeys.links).doc(), link });
    props.closeModal();
  };

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
        setSelectedTags={(tags) => setValue('tags', tags)}
        className="mb-8"
        label="tags"
        errorText={(errors.tags as unknown as FieldError)?.message}
      />
      <div className="flex justify-end">
        <Button theme="secondary" text="Create" type="submit" loading={loading} />
      </div>
    </form>
  );
};

export default AddLinkForm;
