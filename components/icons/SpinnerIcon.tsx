import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { ComponentProps } from 'react';

function SpinnerIcon({ className, ...svgProps }: ComponentProps<typeof Loader2>) {
  return <Loader2 className={cn(className, 'animate-spin')} {...svgProps} />;
}

export default SpinnerIcon;
