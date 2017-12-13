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

  removeMenuItem = item => idx => {
    this.setState(state => ({
      settings: {
        ...state.settings,
        [item]: state.settings[item]
          .slice(0, idx)
          .concat(state.settings[item].slice(idx + 1)),
      },
    }));
  };

  updateMenuItem = item => (idx, key, value) => {
    this.setState(state => ({
      settings: {
        ...state.settings,
        [item]: state.settings[item]
          .slice(0, idx)
          .concat([
            {
              ...state.settings[item][idx],
              [key]: value,
            },
          ])
          .concat(state.settings[item].slice(idx + 1)),
      },
    }));
  };

  addMenuItem = item => {
    this.setState(state => ({
      settings: {
        ...state.settings,
        [item]: state.settings[item].concat([
          {
            tab_title: 'New - Click to edit',
            navigation_folder: '',
            additional_columns: '',
            simple_link: '',
            condition: '',
          },
        ]),
      },
    }));
  };

  setActive = idx => {
    this.setState(state => ({
      active: idx,
    }));
  };

  addNewMenu = () => {
    this.setState(state => ({
      settings: {
        ...state.settings,
      },
      titles: {
        ...state.titles,
      },
      active: Object.keys(state.settings).length + 1,
    }));
  };

  render() {
    return (
      <div className="custom-settings-editor">
        <NavBar
          {...this.state}
          setActive={this.setActive}
          addNewMenu={this.addNewMenu}
        />
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
                <input type="text" defaultValue={item} name={`path-${idx}`} />
              </label>
              <div className="menu-configuration">
                <SortableList
                  key={`conf-${idx}`}
                  items={this.state.settings[item]}
                  removeItemFromThisMenu={this.removeMenuItem(item)}
                  updateItemInThisMenu={this.updateMenuItem(item)}
                  onSortEnd={this.onSortEnd(item)}
                  distance={2}
                  lockAxis="y"
                />
                <button
                  className="plone-btn plone-btn-default add-menu-item-button"
                  type="button"
                  onClick={() => this.addMenuItem(item)}
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
