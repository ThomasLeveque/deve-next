import { env } from '@/env';

export const isDev = env.NEXT_PUBLIC_NODE_ENV === 'development';
