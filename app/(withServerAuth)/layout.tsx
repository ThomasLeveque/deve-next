import { GlobalComponents } from '@components/GlobalComponents';
import Header from '@components/header';
import { cn } from '@utils/cn';

export default async function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className={cn('px-5 xl:container xl:mx-auto')}>{children}</main>

      <GlobalComponents />
    </>
  );
}
