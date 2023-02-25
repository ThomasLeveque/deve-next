import { GlobalComponents } from '@components/GlobalComponents';
import Header from '@components/header';
import ReactQueryClientProvider from '@components/ReactQueryClientProvider';
import { getTags } from '@data/tag/get-tags';
import { cn } from '@utils/cn';
import GlobalTagsClient from 'app/GlobalTagsClient';
import { Poppins } from 'next/font/google';
import '../styles/index.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-poppins',
});

export const revalidate = 3600;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const tags = await getTags();

  return (
    <html lang="en">
      <body className={`${poppins.variable} font-poppins`}>
        <ReactQueryClientProvider>
          <GlobalTagsClient tags={tags} />
          <Header />
          <main className={cn('px-5 xl:container xl:mx-auto')}>{children}</main>

          <GlobalComponents />
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
