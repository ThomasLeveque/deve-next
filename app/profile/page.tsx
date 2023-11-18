import LinkCard from '@/components/LinkCard';
import Pagination from '@/components/Pagination';
import { PAGE_PARAM, pageParser } from '@/lib/constants';
import { fetchLinksByUserId } from '@/lib/queries/fetch-links-by-user-id';
import { fetchProfile } from '@/lib/queries/fetch-profile';
import { fetchTags } from '@/lib/queries/fetch-tags';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Account',
};

type ProfilePageProps = {
  searchParams: { [PAGE_PARAM]?: string | string[] };
};

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const profile = await fetchProfile();

  if (!profile) {
    redirect('/');
  }

  const page = pageParser.parseServerSide(searchParams.page);

  const [{ userLinks, totalPages }, tags] = await Promise.all([fetchLinksByUserId(profile.id, page), fetchTags()]);

  return (
    <section className="mb-8 sm:mt-8">
      <h1 className="mb-8 text-center text-4xl font-bold sm:text-left">All your links</h1>
      <ul className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {userLinks?.map((link) => <LinkCard isProfilLink key={link.id} link={link} profile={profile} tags={tags} />)}
      </ul>
      {totalPages && (
        <div className="flex justify-center">{<Pagination className="mt-8" totalPages={totalPages} />}</div>
      )}
    </section>
  );
}
