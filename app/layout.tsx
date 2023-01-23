import { getUserProfile } from '@api/auth/get-user-profile';
import { GlobalComponents } from '@components/GlobalComponents';
import Header from '@components/header';
import ReactQueryClientProvider from '@components/ReactQueryClientProvider';
import SupabaseAuthProvider from '@components/SupabaseAuthProvider';
import { createServerClient } from '@utils/supabase-server';
import classNames from 'classnames';
import '../styles/index.css';

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
      <body className="font-poppins">
        <SupabaseAuthProvider session={session} profile={profile}>
          <ReactQueryClientProvider>
            <Header />
            <main className={classNames('px-5 xl:container xl:mx-auto')}>{children}</main>

            <GlobalComponents />
          </ReactQueryClientProvider>
        </SupabaseAuthProvider>
      </body>
    </html>
  );
}
