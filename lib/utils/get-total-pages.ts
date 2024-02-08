export function getTotalPages(count: number | null, itemsPerPage: number) {
  const totalPages = count ? Math.ceil(count / itemsPerPage) : null;
  return totalPages && totalPages > 1 ? totalPages : null;
}
