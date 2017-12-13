import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import MenuItem from './MenuItem';

const SortableList = ({ items, removeItemFromThisMenu, updateItemInThisMenu }) => (
  <ul>
    {items.map((conf, conf_idx) => (
      <MenuItem
        {...conf}
        key={`menu-item-${conf_idx}`}
        {...({
          removeItemFromThisMenu,
          updateItemInThisMenu,
          index: conf_idx,
          idx: conf_idx,
        })}
      />
    ))}
  </ul>
);

SortableList.defaultProps = {
  items: [],
  removeItemFromThisMenu: () => {},
  updateItemInThisMenu: () => {},
};

export default SortableContainer(SortableList);
