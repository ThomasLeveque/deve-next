'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { useQueryString } from '@/hooks/use-query-string';
import { useMemo } from 'react';

type PaginationProps = {
  totalPages: number;
  className?: string;
};

function MyPagination({ totalPages, className }: PaginationProps) {
  const { pageQuery, setPageQuery } = useQueryString();

  const delta = 1; // Nombre de pages à afficher de chaque côté de la page actuelle

  const visiblePages = useMemo(() => {
    const start = Math.max(1, pageQuery - delta);
    const end = Math.min(totalPages, pageQuery + delta);

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
  }, [pageQuery, totalPages, delta]);

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
              <PaginationLink isActive={page === pageQuery} onClick={() => setPageQuery(page)}>
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
