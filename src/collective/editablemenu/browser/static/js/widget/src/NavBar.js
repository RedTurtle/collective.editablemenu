import React from 'react';

const NavBar = ({ settings, titles, active, setActive, addNewMenu }) => (
  <nav className="menus-nav" role="tablist">
    {Object.keys(settings).map((item, idx) => (
      <a
        role="tab"
        href={`#menu-${idx}`}
        aria-controls={`menu-${idx}`}
        className={`tab-control ${active === idx ? 'active' : ''}`}
        key={`menu-${idx}`}
        onClick={evt => {
          evt.preventDefault();
          setActive(idx);
        }}
      >
        {titles[item] || item}
      </a>
    ))}
    <a
      role="tab"
      href={`#menu-new`}
      className="add-menu-button"
      key="menu-new"
      onClick={evt => {
        evt.preventDefault();
        addNewMenu();
      }}
    >
      <span>Add new menu</span>
    </a>
  </nav>
);

NavBar.defaultProps = {
  settings: {},
  titles: {},
  active: 0,
  setActive: () => {},
  addNewMenu: () => {},
};

export default NavBar;
