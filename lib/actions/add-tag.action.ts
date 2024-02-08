'use server';

import { addTag } from '@/lib/queries/add-tag';
import { TagInsert } from '@/lib/supabase/types';
import { revalidatePath } from 'next/cache';

export async function addTagAction(tagToAdd: TagInsert) {
  const addedTagId = await addTag(tagToAdd);
  revalidatePath('/', 'layout');

  return addedTagId;
}
