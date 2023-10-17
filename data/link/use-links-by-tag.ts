import { Nullable } from '@/types/shared';
import { formatError } from '@/utils/format-string';
import { supabase } from '@/utils/supabase-client';
import { useInfiniteQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { queryKeys } from './query-keys';

export const TAG_LINKS_PER_PAGE = Number(process.env.NEXT_PUBLIC_LINKS_PER_PAGE) ?? 20;

export type GetLinksByTagsReturn = Awaited<ReturnType<typeof getLinksByTag>>;

const getLinksByTag = async (cursor: number, tagSlug: string) => {
  try {
    const nextCursor = cursor + TAG_LINKS_PER_PAGE;
    const response = await supabase
      .from('links')
      .select(
        `
      *,
      user:profiles(*),
      temp_tags:tags!inner(*, links(id)),
      tags(*, links(id)),
      comments(*),
      votes(*)
    `
      )
      .eq('temp_tags.slug', tagSlug)
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

export const useTagLinks = (tagSlug: Nullable<string>) =>
  useInfiniteQuery({
    queryKey: queryKeys.tagLinks(tagSlug as string),
    queryFn: (context) => getLinksByTag(context.pageParam, tagSlug as string),
    enabled: !!tagSlug,
    getNextPageParam: (lastPage) => lastPage?.cursor,
    initialPageParam: 0,
  });
