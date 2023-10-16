import { OrderLinksKey, useQueryString } from '@/hooks/use-query-string';
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
import { objectEntries } from '@/utils/object-entries';

const orderLinksDropdownItems = {
  newest: {
    text: 'Most recent',
    icon: <ArrowDownNarrowWide size={18} />,
  },
  oldest: {
    text: 'Oldest',
    icon: <ArrowUpNarrowWide size={18} />,
  },
  liked: {
    text: 'The hottest',
    icon: <ThumbsUp size={18} />,
  },
} satisfies Record<
  OrderLinksKey,
  {
    text: string;
    icon: JSX.Element;
  }
>;

function OrderbyLinksDropdown() {
  const { setOrderbyQuery, orderbyQuery } = useQueryString();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{orderLinksDropdownItems[orderbyQuery].text}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
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
