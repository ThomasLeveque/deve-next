'use server';

import { removeTag } from '@/lib/queries/remove-tag';
import { revalidatePath } from 'next/cache';

export async function removeTagAction(tagId: number) {
  const removedTagId = await removeTag(tagId);
  revalidatePath('/', 'layout');

  return removedTagId;
}
