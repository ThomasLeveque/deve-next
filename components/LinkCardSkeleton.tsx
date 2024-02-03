import { TagListWrapper } from '@/components/TagListWrapper';
import { Skeleton } from '@/components/ui/skeleton';

export function LinkCardSkeleton() {
  return (
    <div className="flex flex-col rounded-lg border shadow-sm">
      <div className="space-y-5 p-6">
        <div>
          <Skeleton className="mb-2 h-4 w-[140px] max-w-full" />
          <Skeleton className="h-4 w-[100px] max-w-full" />
        </div>
        <Skeleton className="h-[50px] w-full rounded-xl" />
      </div>
      <TagListWrapper className="p-6 pt-0">
        <Skeleton className="h-4 w-[60px] max-w-full" />
        <Skeleton className="h-4 w-[60px] max-w-full" />
        <Skeleton className="h-4 w-[60px] max-w-full" />
      </TagListWrapper>

      <div className="flex space-x-4 p-6 pt-0">
        <Skeleton className="h-4 w-[150px] max-w-full" />
      </div>
    </div>
  );
}
