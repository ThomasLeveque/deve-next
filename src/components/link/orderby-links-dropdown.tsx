import { FireIcon, SortAscendingIcon, SortDescendingIcon } from '@heroicons/react/outline';
import React, { useMemo } from 'react';

import MenuDropdown, { MenuDropdownItemProps } from '@components/elements/menu-dropdown';

import { OrderLinksKey, useQueryString } from '@hooks/use-query-string';

const OrderbyLinksDropdown: React.FC = React.memo(() => {
  const { updateOrderbyQuery, orderbyQuery } = useQueryString();

  const orderLinksDropdownItems: Record<OrderLinksKey, MenuDropdownItemProps> = useMemo(
    () => ({
      newest: {
        text: 'Most recent',
        onClick: () => updateOrderbyQuery('newest'),
        icon: <SortDescendingIcon />,
      },
      oldest: {
        text: 'Oldest',
        onClick: () => updateOrderbyQuery('oldest'),
        icon: <SortAscendingIcon />,
      },
      liked: {
        text: 'Most liked',
        onClick: () => updateOrderbyQuery('liked'),
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
