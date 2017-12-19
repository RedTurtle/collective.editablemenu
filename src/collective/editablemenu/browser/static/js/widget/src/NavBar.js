import React from 'react';
import FaPlus from 'react-icons/lib/fa/plus';

const NavBar = ({
  settings,
  titles,
  active,
  setActive,
  addNewMenu,
  translate,
}) => (
  <nav className="menus-nav" role="tablist">
    {Object.keys(settings).map((item, idx) => {
      const menuId = titles[item] || item;
      const idToUse = menuId
        .replace(/\//g, '')
        .replace(/\s/g, '-')
        .toLowerCase();
      return (
        <a
          role="tab"
          href={`#menu-${idToUse}`}
          aria-controls={`menu-${idToUse}`}
          className={`tab-control ${active === idx ? 'active' : ''}`}
          key={`menu-${idToUse}`}
          onClick={evt => {
            evt.preventDefault();
            setActive(idx);
          }}
        >
          {titles[item] || item}
        </a>
      );
    })}
    <a
      role="tab"
      href={`#menu-new`}
      className="add-menu-button"
      key="menu-new"
      title={translate('add_menu', 'Add new menu')}
      onClick={evt => {
        evt.preventDefault();
        addNewMenu();
      }}
    >
      <FaPlus />
      <span className="sr-only">{translate('add_menu', 'Add new menu')}</span>
    </a>
  </nav>
);

NavBar.defaultProps = {
  settings: {},
  titles: {},
  active: 0,
  setActive: () => {},
  addNewMenu: () => {},
  translate: (key, defaultMessage) => defaultMessage,
};

export default NavBar;
