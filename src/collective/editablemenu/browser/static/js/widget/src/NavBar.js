import React from 'react';

const NavBar = ({ settings, titles, active }) => (
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
        }}
      >
        {titles[item] || item}
      </a>
    ))}
  </nav>
);

export default NavBar;
