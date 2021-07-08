import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Button from '@components/elements/button';
import TextInput from '@components/elements/text-input';
import TagsListBox from '@components/tag/tags-list-box';

import { useCategories } from '@libs/category/queries';

interface FormData {
  url: string;
  title: string;
}

const schema = yup.object().shape({
  url: yup.string().required().max(255),
  title: yup.string().required().max(255),
});

const AddLinkForm: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const { data: tags } = useCategories();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async ({ url, title }: FormData) => {
    setLoading(true);
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
        error={errors.url}
      />
      <TextInput
        className="mb-6"
        id="title"
        label="Title"
        placeholder="A title for your link"
        {...register('title')}
        error={errors.title}
      />
      <TagsListBox tags={tags} className="mb-8" label="tags" />
      <div className="flex justify-end">
        <Button theme="secondary" text="Create" className="ml-5" type="submit" loading={loading} />
      </div>
    </form>
  );
};

export default AddLinkForm;
