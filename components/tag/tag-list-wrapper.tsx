import { cn } from '@/lib/utils';
import React from 'react';

const TagListWrapper: React.FC<{ className?: string; children: React.ReactNode | React.ReactNode[] }> = (props) => {
  return <ul className={cn('flex flex-wrap gap-[10px] gap-y-3', props.className)}>{props.children}</ul>;
};

export default TagListWrapper;
