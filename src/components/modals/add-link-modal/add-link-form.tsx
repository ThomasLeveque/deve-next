import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { FieldError, useForm } from 'react-hook-form';
import * as yup from 'yup';

import Button from '@components/elements/button';
import TextInput from '@components/elements/text-input';
import TagsListBox from '@components/tag/tags-list-box';

import { useCategories } from '@libs/category/queries';

interface FormData {
  url: string;
  title: string;
  tags: string[];
}

const schema = yup.object().shape({
  url: yup.string().required('An url is required').max(255),
  title: yup.string().required('A title is required').max(255),
  tags: yup
    .array(yup.string())
    .required('At least on tag required')
    .min(1, 'At least 1 tag required')
    .max(4, 'No more than 4 tags'),
});

const AddLinkForm: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const { data: tags } = useCategories();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async ({ url, title, tags }: FormData) => {
    // setLoading(true);
    // Do not setLoading(false) because Signin will unmount this component.
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
        placeholder="A title for your link"
        {...register('title')}
        errorText={errors.title?.message}
      />
      <TagsListBox
        tags={tags}
        selectedTags={watch('tags', [])}
        setSelectedTags={(tags) => setValue('tags', tags)}
        className="mb-8"
        label="tags"
        errorText={(errors.tags as unknown as FieldError)?.message}
      />
      <div className="flex justify-end">
        <Button theme="secondary" text="Create" className="ml-5" type="submit" loading={loading} />
      </div>
    </form>
  );
};

export default AddLinkForm;
