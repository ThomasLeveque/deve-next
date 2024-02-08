'use server';

import { FetchTagsReturn } from '@/lib/queries/fetch-tags';
import { updateLink } from '@/lib/queries/update-link';
import { LinkUpdate } from '@/lib/supabase/types';
import { revalidatePath } from 'next/cache';

export async function updateLinkAction(linkId: number, linkToUpdate: LinkUpdate, tags: FetchTagsReturn) {
  await updateLink(linkId, linkToUpdate, tags);
  revalidatePath('/', 'layout');
}
