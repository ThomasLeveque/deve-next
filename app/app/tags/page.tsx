'use client';

import { TagRow, useTags } from '@api/tag/use-tags';
import SpinnerIcon from '@components/icons/spinner-icon';
import TagItem from '@components/tag/tag-item';
import TagListWrapper from '@components/tag/tag-list-wrapper';
import { useCustomRouter } from '@hooks/useCustomRouter';
import { singleToArray } from '@utils/single-to-array';
import toast from 'react-hot-toast';

export default function Tags() {
  const router = useCustomRouter();
  const { data: tags } = useTags();

  function goToTagPage(tag: TagRow) {
    if (tag.slug) {
      router.push(`/tags/${tag.slug}`);
    } else {
      toast.error('Tag slug not defined');
    }
  }

  return (
    <section className="my-8">
      <h1 className="mb-8 text-center font-poppins-bold text-4xl sm:text-left">Tags</h1>
      {tags && tags.length > 0 ? (
        <TagListWrapper className="mb-4">
          {tags
            .filter((tag) => singleToArray(tag.links).length > 0)
            .map((tag) => (
              <li key={tag.id}>
                <TagItem
                  size="large"
                  text={`${tag.name} (${singleToArray(tag.links).length ?? 0})`}
                  isColored
                  onClick={() => goToTagPage(tag)}
                />
              </li>
            ))}
        </TagListWrapper>
      ) : (
        <SpinnerIcon className="m-auto mt-14 w-10" />
      )}
    </section>
  );
}
