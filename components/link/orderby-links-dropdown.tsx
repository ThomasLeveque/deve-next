import MenuDropdown, { MenuDropdownItemProps } from '@/components/elements/menu-dropdown';
import { OrderLinksKey, useQueryString } from '@/hooks/use-query-string';
import { ArrowDownNarrowWide, ArrowUpNarrowWide, ThumbsUp } from 'lucide-react';
import React, { useMemo } from 'react';

const OrderbyLinksDropdown: React.FC = React.memo(() => {
  const { setOrderbyQuery, orderbyQuery } = useQueryString();

  const orderLinksDropdownItems: Record<OrderLinksKey, MenuDropdownItemProps> = useMemo(
    () => ({
      newest: {
        text: 'Most recent',
        onClick: () => setOrderbyQuery('newest'),
        icon: <ArrowDownNarrowWide size={18} />,
      },
      oldest: {
        text: 'Oldest',
        onClick: () => setOrderbyQuery('oldest'),
        icon: <ArrowUpNarrowWide size={18} />,
      },
      liked: {
        text: 'The hottest',
        onClick: () => setOrderbyQuery('liked'),
        icon: <ThumbsUp size={18} />,
      },
    }),
    []
  );

  return (
    <MenuDropdown
      items={Object.values(orderLinksDropdownItems)}
      dropdownPosition="left"
      defaultButtonText={orderLinksDropdownItems[orderbyQuery].text}
    />
  );
});

export default OrderbyLinksDropdown;
