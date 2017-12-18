import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import MenuItem from './MenuItem';

const SortableList = ({
  menuId,
  portalUrl,
  translate,
  items,
  removeItemFromThisMenu,
  updateItemInThisMenu,
}) => (
  <ul>
    {items.map((conf, conf_idx) => (
      <MenuItem
        {...conf}
        key={`${menuId}-${conf_idx}`}
        {...{
          removeItemFromThisMenu,
          updateItemInThisMenu,
          menuId,
          portalUrl,
          translate,
          index: conf_idx,
          idx: conf_idx,
        }}
      />
    ))}
  </ul>
);

SortableList.defaultProps = {
  menuId: 'menu-new-x',
  portalUrl: '',
  translate: (key, defaultMessage) => defaultMessage,
  items: [],
  removeItemFromThisMenu: () => {},
  updateItemInThisMenu: () => {},
};

export default SortableContainer(SortableList);
