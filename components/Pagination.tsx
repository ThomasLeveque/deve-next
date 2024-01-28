'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { PAGE_PARAM, pageParser } from '@/lib/constants';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

type PaginationProps = {
  totalPages: number;
  className?: string;
};

function MyPagination({ totalPages, className }: PaginationProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = pageParser.parseServerSide(searchParams.get(PAGE_PARAM) ?? undefined);

  const delta = 1; // Nombre de pages à afficher de chaque côté de la page actuelle

  const visiblePages = useMemo(() => {
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);

    const pages: (number | 'ellipsis')[] = Array.from({ length: end - start + 1 }, (_, i) => start + i);

    // Assurez-vous d'avoir toujours la première et la dernière page dans la liste
    if (pages[0] !== 1) {
      pages.unshift('ellipsis');
      pages.unshift(1);
    }
    if (pages[pages.length - 1] !== totalPages) {
      pages.push('ellipsis');
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages, delta]);

  const handlePageChange = (page: number) => {
    return () => {
      if (page === currentPage) {
        return;
      }

      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set(PAGE_PARAM, pageParser.serialize(page));
      router.push(`?${newSearchParams.toString()}`);
    };
  };

  return (
    <Pagination className={className}>
      <PaginationContent>
        {visiblePages.map((page, index) =>
          page === 'ellipsis' ? (
            <PaginationItem key={'ellipsis' + index}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink isActive={page === currentPage} onClick={handlePageChange(page)}>
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}
      </PaginationContent>
    </Pagination>
  );
}

export default MyPagination;
