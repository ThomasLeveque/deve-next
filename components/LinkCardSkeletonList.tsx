import { LinkCardSkeleton } from '@/components/LinkCardSkeleton';

export function LinkCardSkeletonList() {
  return (
    <ul className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 12 }).map((_, index) => (
        <LinkCardSkeleton key={index} />
      ))}
    </ul>
  );
}
