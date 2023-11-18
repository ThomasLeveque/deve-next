import { cn } from '@/utils/cn';
import { PropsWithChildren } from 'react';

export function TagListWrapper(props: PropsWithChildren<{ className?: string }>) {
  return <ul className={cn('flex flex-wrap gap-[10px] gap-y-3', props.className)}>{props.children}</ul>;
}
