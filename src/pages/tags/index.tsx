import { useTags } from '@api/tag/use-tags';
import TagItem from '@components/tag/tag-item';
import TagListWrapper from '@components/tag/tag-list-wrapper';
import { Tag } from '@models/tag';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { Page } from '../_app';

const Tags: Page = () => {
  const router = useRouter();
  const { data: tags } = useTags({ refetchOnMount: false });

  function goToTagPage(tag: Tag) {
    if (tag.slug) {
      router.push(`/tags/${tag.slug}`);
    } else {
      toast.error('Tag slug not defined');
    }
  }

  return (
    <section className="my-8">
      <h1 className="mb-8 text-center font-poppins-bold text-4xl sm:text-left">Tags</h1>
      {tags && tags.length > 0 && (
        <TagListWrapper className="mb-4">
          {tags.map((tag) => (
            <TagItem
              size="large"
              key={tag.id}
              text={`${tag.name} (${tag.links?.length ?? 0})`}
              isColored
              onClick={() => goToTagPage(tag)}
            />
          ))}
        </TagListWrapper>
      )}
    </section>
  );
};

export default Tags;
