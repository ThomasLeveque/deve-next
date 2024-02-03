import LinkCard from '@/components/LinkCard';
import MyPagination from '@/components/Pagination';
import { FetchLinksReturn } from '@/lib/queries/fetch-links';
import { FetchLinksByTagSlugReturn } from '@/lib/queries/fetch-links-by-tag-slug';
import { FetchLinksByUserIdReturn } from '@/lib/queries/fetch-links-by-user-id';
import { FetchProfileReturn } from '@/lib/queries/fetch-profile';
import { FetchTagsReturn } from '@/lib/queries/fetch-tags';

type LinksListProps = {
  profile: FetchProfileReturn;
  linksPromise: Promise<[FetchLinksReturn | FetchLinksByUserIdReturn | FetchLinksByTagSlugReturn, FetchTagsReturn]>;
};

export async function LinksList({ linksPromise, profile }: LinksListProps) {
  const [{ links, totalPages }, tags] = await linksPromise;

  return (
    <>
      <ul className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {links.map((link) => (
          <LinkCard key={link.id} link={link} profile={profile} tags={tags} />
        ))}
      </ul>
      {totalPages && (
        <div className="flex justify-center">{<MyPagination className="mt-8" totalPages={totalPages} />}</div>
      )}
    </>
  );
}
