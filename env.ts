import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    MY_SECRET_TOKEN: z.string(),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_LINKS_PER_PAGE: z.coerce.number().transform((value) => (isNaN(value) ? 20 : value)),
    NEXT_PUBLIC_COMMENTS_PER_PAGE: z.coerce.number().transform((value) => (isNaN(value) ? 20 : value)),
    NEXT_PUBLIC_NODE_ENV: z.enum(['development', 'production']).default('development'),
    NEXT_PUBLIC_VERCEL_URL: z.string().url(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_LINKS_PER_PAGE: process.env.NEXT_PUBLIC_LINKS_PER_PAGE,
    NEXT_PUBLIC_COMMENTS_PER_PAGE: process.env.NEXT_PUBLIC_COMMENTS_PER_PAGE,
    MY_SECRET_TOKEN: process.env.MY_SECRET_TOKEN,
    NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
    NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
  },
});
