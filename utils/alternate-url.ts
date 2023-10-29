import { env } from '@/env';
import { Nullish } from '@/types/shared';

import { isDev } from '@/utils/is-dev';

export default function getAlternateUrl(url: Nullish<string> = '') {
  return `${isDev ? 'http://localhost:3000' : env.NEXT_PUBLIC_VERCEL_URL}${url}`;
}
