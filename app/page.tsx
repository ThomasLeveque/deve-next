import { LinkCardSkeletonList } from '@/components/LinkCardSkeletonList';
import { LinksList } from '@/components/LinksList';
import OrderbyLinksDropdown from '@/components/OrderbyLinksDropdown';
import { SearchInput } from '@/components/SearchInput';
import { ORDERBY_PARAM, OrderLinksKey, PAGE_PARAM, SEARCH_PARAM, orderLinksKeys, pageParser } from '@/lib/constants';
import { fetchLinks } from '@/lib/queries/fetch-links';
import { fetchProfile } from '@/lib/queries/fetch-profile';
import { fetchTags } from '@/lib/queries/fetch-tags';
import { objectValues } from '@/utils/object-values';
import { parseAsString, parseAsStringEnum } from 'next-usequerystate/parsers';
import { Suspense } from 'react';

const orderByParser = parseAsStringEnum<OrderLinksKey>(objectValues(orderLinksKeys)).withDefault('newest');

type HomePageProps = {
  searchParams: {
    [PAGE_PARAM]?: string | string[];
    [ORDERBY_PARAM]?: string | string[];
    [SEARCH_PARAM]?: string | string[];
  };
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const page = pageParser.parseServerSide(searchParams.page);
  const orderBy = orderByParser.parseServerSide(searchParams[ORDERBY_PARAM]);
  const search = parseAsString.parseServerSide(searchParams[SEARCH_PARAM]);

  const profile = await fetchProfile();

  return (
    <section className="my-8">
      <div className="mb-5 flex space-x-2">
        <OrderbyLinksDropdown className="flex-none" />
        <SearchInput
          placeholder="Search for a link by description or url..."
          className="w-full"
          inputClassName="w-full"
        />
      </div>
      <Suspense fallback={<LinkCardSkeletonList />}>
        <LinksList profile={profile} linksPromise={Promise.all([fetchLinks(page, orderBy, search), fetchTags()])} />
      </Suspense>
    </section>
  );
}
