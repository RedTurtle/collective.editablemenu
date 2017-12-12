import React, { Component } from 'react';
import { arrayMove } from 'react-sortable-hoc';
import NavBar from './NavBar';
import SortableList from './SortableList';

class App extends Component {
  constructor() {
    super();
    this.state = {
      settings: {},
      titles: {},
      active: 0,
    };
    try {
      this.state.settings = JSON.parse(
        document.getElementById('root').getAttribute('data-settings')
      );
    } catch (e) {
      console.error('Failed to load settings');
    }
    try {
      this.state.titles = JSON.parse(
        document.getElementById('root').getAttribute('data-titles')
      );
    } catch (e) {
      console.error('Failed to load titles');
    }
  }

  onSortEnd = item => ({ oldIndex, newIndex }) => {
    this.setState(state => ({
      settings: {
        ...state.settings,
        [item]: arrayMove(state.settings[item], oldIndex, newIndex),
      },
    }));
  };

  render() {
    return (
      <div className="custom-settings-editor">
        <NavBar {...this.state} />
        {Object.keys(this.state.settings).map((item, idx) => (
          <fieldset
            id={`menu-${idx}`}
            key={`menu-${idx}`}
            role="tabpanel"
            {...(this.state.active === idx ? { className: 'active' } : {})}
          >
            <legend>{this.state.titles[item] || item}</legend>
            <div className="tab-content">
              <label>
                <span>Path</span>
                <input type="text" value={item} name={`path-${idx}`} />
              </label>
              <div className="menu-configuration">
                <SortableList
                  items={this.state.settings[item]}
                  onSortEnd={this.onSortEnd(item)}
                />
                <button
                  className="plone-btn plone-btn-default add-menu-item-button"
                  type="button"
                >
                  Add item
                </button>
              </div>
            </div>
          </fieldset>
        ))}
      </div>
    );
  }
}

export default App;
