'use client';

import { useQueryString } from '@/hooks/use-query-string';
import { ArrowDownNarrowWide, ArrowUpNarrowWide, ThumbsUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { OrderLinksKey } from '@/lib/constants';
import { objectEntries } from '@/utils/object-entries';

const orderLinksDropdownItems = {
  newest: {
    text: 'Most recent',
    icon: <ArrowDownNarrowWide size={16} className="mr-2" />,
  },
  oldest: {
    text: 'Oldest',
    icon: <ArrowUpNarrowWide size={16} className="mr-2" />,
  },
  liked: {
    text: 'The hottest',
    icon: <ThumbsUp size={16} className="mr-2" />,
  },
} satisfies Record<
  OrderLinksKey,
  {
    text: string;
    icon: JSX.Element;
  }
>;

function OrderbyLinksDropdown({ className }: { className?: string }) {
  const { setOrderbyQuery, orderbyQuery } = useQueryString();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={className}>
        <Button variant="outline">{orderLinksDropdownItems[orderbyQuery].text}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Filtering</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {objectEntries(orderLinksDropdownItems).map(([key, item]) => (
            <DropdownMenuItem key={key} onClick={() => setOrderbyQuery(key)}>
              {item.icon}
              <span>{item.text}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default OrderbyLinksDropdown;
