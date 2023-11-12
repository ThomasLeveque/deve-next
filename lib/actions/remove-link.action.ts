'use server';

import { removeLink } from '@/lib/queries/remove-link';
import { revalidatePath } from 'next/cache';

export async function removeLinkAction(linkId: number) {
  await removeLink(linkId);
  revalidatePath('/', 'layout');
}
