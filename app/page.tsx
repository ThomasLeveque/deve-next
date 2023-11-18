import LinkCard from '@/components/LinkCard';
import OrderbyLinksDropdown from '@/components/OrderbyLinksDropdown';
import Pagination from '@/components/Pagination';
import { SearchInput } from '@/components/SearchInput';
import { ORDERBY_PARAM, OrderLinksKey, PAGE_PARAM, SEARCH_PARAM, orderLinksKeys, pageParser } from '@/lib/constants';
import { fetchLinks } from '@/lib/queries/fetch-links';
import { fetchProfile } from '@/lib/queries/fetch-profile';
import { fetchTags } from '@/lib/queries/fetch-tags';
import { objectValues } from '@/utils/object-values';
import { parseAsString, parseAsStringEnum } from 'next-usequerystate/parsers';

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

  const [{ links, totalPages }, tags] = await Promise.all([fetchLinks(page, orderBy, search), fetchTags()]);

  return (
    <section className="my-8">
      <div className="mb-5 flex space-x-2">
        <OrderbyLinksDropdown className="flex-none" />
        <SearchInput placeholder="Search for a link..." className="w-full" inputClassName="w-full" />
      </div>
      <ul className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {links.map((link) => (
          <LinkCard key={link.id} link={link} profile={profile} tags={tags} />
        ))}
      </ul>
      {totalPages && (
        <div className="flex justify-center">{<Pagination className="mt-8" totalPages={totalPages} />}</div>
      )}
    </section>
  );
}
