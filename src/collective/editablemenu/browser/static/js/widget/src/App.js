import React, { Component } from 'react';
import { arrayMove } from 'react-sortable-hoc';
import NavBar from './NavBar';
import SortableList from './SortableList';

class App extends Component {
  static defaultProps = {
    portalUrl: '',
    translations: {},
  };

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

  translate = (key, defaultMessage) =>
    this.props.translations[key] || defaultMessage;

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
            tab_title: 'New',
            navigation_folder: '',
            additional_columns: '',
            simple_link: '',
            condition: 'python: True',
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

  findFreeIndex = (state, idx) =>
    state.settings.hasOwnProperty(`/new${idx}`)
      ? this.findFreeIndex(state, idx + 1)
      : idx;

  addNewMenu = () => {
    this.setState(state => {
      const newIdx = Object.keys(state.settings).length;
      const freeIdx = this.findFreeIndex(state, newIdx);
      return {
        settings: {
          ...state.settings,
          [`/new${freeIdx}`]: [
            {
              tab_title: 'New',
              navigation_folder: '',
              additional_columns: '',
              simple_link: '',
              condition: 'python: True',
            },
          ],
        },
        titles: {
          ...state.titles,
          [`/new${freeIdx}`]: `/new${freeIdx}`,
        },
        active: newIdx,
      };
    });
  };

  removeMenu = menu => {
    this.setState(state => {
      const { [menu]: deletedSetting, ...remainingSettings } = state.settings;
      const { [menu]: deletedTitle, ...remainingTitles } = state.titles;
      return {
        settings: remainingSettings,
        titles: remainingTitles,
        active: 0,
      };
    });
  };

  render() {
    return (
      <div className="custom-settings-editor">
        <NavBar
          {...this.state}
          setActive={this.setActive}
          addNewMenu={this.addNewMenu}
          translate={this.translate}
        />
        {Object.keys(this.state.settings).map((item, idx) => {
          const menuId = this.state.titles[item] || item;
          const idToUse = menuId
            .replace(/\//g, '')
            .replace(/\s/g, '-')
            .toLowerCase();
          return (
            <fieldset
              id={`menu-${idToUse}`}
              key={`menu-${idToUse}`}
              role="tabpanel"
              {...(this.state.active === idx ? { className: 'active' } : {})}
            >
              <legend>{menuId}</legend>
              <div className="tab-content">
                <label>
                  <span>{this.translate('path_label', 'Path')}</span>
                  <input
                    type="text"
                    defaultValue={item}
                    name={`path-${idToUse}`}
                  />
                </label>
                <div className="menu-configuration">
                  <SortableList
                    key={`conf-${idToUse}`}
                    portalUrl={this.props.portalUrl}
                    menuId={idToUse}
                    translate={this.translate}
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
                    {this.translate('add_menu_item', 'Add item')}
                  </button>
                  {idx > 0 ? (
                    <div className="remove-menu-wrapper">
                      <button
                        type="button"
                        className="plone-btn plone-btn-danger remove-menu-button"
                        onClick={() => this.removeMenu(item)}
                      >
                        {this.translate('remove_menu', 'Remove this menu')}
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </fieldset>
          );
        })}
      </div>
    );
  }
}

export default App;
