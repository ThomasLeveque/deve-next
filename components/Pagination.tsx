'use client';

import { Button } from '@/components/ui/button';
import { PAGE_PARAM, pageParser } from '@/lib/constants';
import { cn } from '@/utils/cn';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

type PaginationProps = {
  totalPages: number;
  className?: string;
};

function Pagination({ totalPages, className }: PaginationProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = pageParser.parseServerSide(searchParams.get(PAGE_PARAM) ?? undefined);

  const delta = 1; // Nombre de pages à afficher de chaque côté de la page actuelle

  const visiblePages = useMemo(() => {
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);

    const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

    // Assurez-vous d'avoir toujours la première et la dernière page dans la liste
    if (pages[0] !== 1) pages.unshift(1);
    if (pages[pages.length - 1] !== totalPages) pages.push(totalPages);

    return pages;
  }, [currentPage, totalPages, delta]);

  const handlePageChange = (page: number) => {
    if (page === currentPage) {
      return;
    }

    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set(PAGE_PARAM, pageParser.serialize(page));
    router.push(`?${newSearchParams.toString()}`);
  };

  return (
    <ul className={cn('inline-flex gap-2', className)}>
      {visiblePages.map((page) => (
        <li key={page}>
          <Button variant={page === currentPage ? 'default' : 'link'} onClick={() => handlePageChange(page)}>
            {page}
          </Button>
        </li>
      ))}
    </ul>
  );
}

export default Pagination;
