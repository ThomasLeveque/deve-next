import AppProvider from '@/app/_components/AppProvider';
import BackToTop from '@/app/_components/BackToTop';
import { Navigation } from '@/app/_components/Navigation';
import { cn } from '@/lib/utils';
import { Poppins } from 'next/font/google';

import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
});

export const metadata = {
  title: { default: 'Deve-next', template: '%s - Deve-next' },
  description: 'The place to pratice technical watch',
  manifest: '/favicon/site.webmanifest',
  icons: {
    icon: ['/favicon/favicon-32x32.png', '/favicon/favicon-16x16.png'],
    apple: '/favicon/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-poppins`}>
        <AppProvider>
          <Navigation />
          <main className={cn('px-5 xl:container xl:mx-auto')}>{children}</main>

          <BackToTop />
        </AppProvider>
      </body>
    </html>
  );
}
