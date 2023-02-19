import { GlobalComponents } from '@components/GlobalComponents';
import Header from '@components/header';
import { getTags } from '@data/tag/get-tags';
import { cn } from '@utils/cn';
import GlobalTagsClient from 'app/(withServerAuth)/globalTagsClient';

export default async function layout({ children }: { children: React.ReactNode }) {
  const tags = await getTags();

  return (
    <>
      <GlobalTagsClient tags={tags} />
      <Header />
      <main className={cn('px-5 xl:container xl:mx-auto')}>{children}</main>

      <GlobalComponents />
    </>
  );
}
