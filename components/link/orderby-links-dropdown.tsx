import MenuDropdown, { MenuDropdownItemProps } from '@/components/elements/menu-dropdown';
import { OrderLinksKey, useQueryString } from '@/hooks/use-query-string';
import { BarsArrowDownIcon, BarsArrowUpIcon, FireIcon } from '@heroicons/react/24/outline';
import React, { useMemo } from 'react';

const OrderbyLinksDropdown: React.FC = React.memo(() => {
  const { setOrderbyQuery, orderbyQuery } = useQueryString();

  const orderLinksDropdownItems: Record<OrderLinksKey, MenuDropdownItemProps> = useMemo(
    () => ({
      newest: {
        text: 'Most recent',
        onClick: () => setOrderbyQuery('newest'),
        icon: <BarsArrowDownIcon />,
      },
      oldest: {
        text: 'Oldest',
        onClick: () => setOrderbyQuery('oldest'),
        icon: <BarsArrowUpIcon />,
      },
      liked: {
        text: 'The hottest',
        onClick: () => setOrderbyQuery('liked'),
        icon: <FireIcon />,
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
