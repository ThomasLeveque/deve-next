import { env } from '@/env';
import { Nullish } from '@/types/shared';

export default function getAlternateUrl(url: Nullish<string> = '') {
  return `${env.NEXT_PUBLIC_VERCEL_URL}${url}`;
}
