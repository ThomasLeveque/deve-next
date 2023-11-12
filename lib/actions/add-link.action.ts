'use server';

import { addLink } from '@/lib/queries/add-link';
import { FetchTagsReturn } from '@/lib/queries/fetch-tags';
import { LinkInsert } from '@/lib/supabase/types';
import { revalidatePath } from 'next/cache';

export async function addLinkAction(linkToAdd: LinkInsert, tags: FetchTagsReturn = []) {
  await addLink(linkToAdd, tags);
  revalidatePath('/', 'layout');
}
