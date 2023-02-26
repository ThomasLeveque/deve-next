import { GlobalComponents } from '@components/GlobalComponents';
import Header from '@components/header';
import ReactQueryClientProvider from '@components/ReactQueryClientProvider';
import { cn } from '@utils/cn';
import { Poppins } from 'next/font/google';
import '../styles/index.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-poppins',
});

// export const revalidate = 60;

export const metadata = {
  title: { default: 'Deve-next', template: '%s - Deve-next' },
  description: 'The place to pratice technical watch',
  themeColor: '#ffffff',
  manifest: '/favicon/site.webmanifest',
  icons: {
    icon: ['/favicon/favicon-32x32.png', '/favicon/favicon-16x16.png'],
    apple: '/favicon/apple-touch-icon.png',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // const tags = await getTags();

  return (
    <html lang="en">
      <body className={`${poppins.variable} font-poppins`}>
        <ReactQueryClientProvider>
          {/* <GlobalTagsClient tags={tags} /> */}
          <Header />
          <main className={cn('px-5 xl:container xl:mx-auto')}>{children}</main>

          <GlobalComponents />
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
