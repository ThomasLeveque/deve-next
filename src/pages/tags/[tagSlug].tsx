import { useRouter } from 'next/router';
import { Page } from '../_app';

const TagPage: Page = () => {
  const router = useRouter();

  return (
    <section className="my-8">
      <h1 className="mb-8 text-center font-poppins-bold text-4xl sm:text-left">Tag {router.query.tagSlug}</h1>
    </section>
  );
};

export default TagPage;
