import { GlobalComponents } from '@components/GlobalComponents';
import Header from '@components/header';
import ReactQueryClientProvider from '@components/ReactQueryClientProvider';
import SupabaseAuthProvider from '@components/SupabaseAuthProvider';
import { getUserProfile } from '@data/auth/get-user-profile';
import { Poppins } from '@next/font/google';
import { cn } from '@utils/cn';
import { createServerClient } from '@utils/supabase-server';
import '../styles/index.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-poppins',
});

// do not cache this layout
export const revalidate = 0;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const profile = await getUserProfile(session?.user, supabase);

  return (
    <html lang="en">
      <body className={`${poppins.variable} font-poppins`}>
        <SupabaseAuthProvider session={session} profile={profile}>
          <ReactQueryClientProvider>
            <Header />
            <main className={cn('px-5 xl:container xl:mx-auto')}>{children}</main>

            <GlobalComponents />
          </ReactQueryClientProvider>
        </SupabaseAuthProvider>
      </body>
    </html>
  );
}
