import { formatError } from '@utils/format-string';
import { supabase } from '@utils/init-supabase';
import toast from 'react-hot-toast';
import { useInfiniteQuery } from 'react-query';
import { queryKeys } from './query-keys';

export const TAG_LINKS_PER_PAGE = Number(process.env.NEXT_PUBLIC_LINKS_PER_PAGE) ?? 20;

export type GetLinksByTagsReturn = Awaited<ReturnType<typeof getLinksByTag>>;

const getLinksByTag = async (cursor = 0, tagSlug: string) => {
  try {
    const nextCursor = cursor + TAG_LINKS_PER_PAGE;
    const response = await supabase
      .from('links')
      .select(
        `
      *,
      user:profiles!links_userId_fkey(*),
      tags!inner(*, links(id)),
      comments(*),
      votes(*)
    `
      )
      // @ts-ignore
      .eq('tags.slug', tagSlug)
      .order('createdAt', { ascending: false })
      .range(cursor, nextCursor - 1);

    const tagLinks = response.data;

    if (!tagLinks) {
      throw new Error('Cannot get tag links, try to reload the page');
    }

    return {
      data: tagLinks,
      cursor: tagLinks.length < TAG_LINKS_PER_PAGE ? undefined : nextCursor,
    };
  } catch (err) {
    toast.error(formatError(err as Error));
    console.error(err);

    return {
      data: [],
      cursor: undefined,
    };
  }
};

export const useTagLinks = (tagSlug: string | undefined) =>
  useInfiniteQuery(
    queryKeys.tagLinks(tagSlug as string),
    (context) => getLinksByTag(context.pageParam, tagSlug as string),
    {
      enabled: !!tagSlug,
      getNextPageParam: (lastPage) => lastPage?.cursor,
    }
  );
