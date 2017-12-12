import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import MenuItem from './MenuItem';

const SortableList = ({ items }) => (
  <ul>
    {items.map((conf, conf_idx) => (
      <MenuItem
        key={
          (conf.tab_title && conf.tab_title.replace(/\s/, '-').toLowerCase()) ||
          `${conf_idx}`
        }
        {...conf}
      />
    ))}
  </ul>
);

export default SortableContainer(SortableList);
