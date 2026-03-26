// App.js
import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import SortableList from './SortableList';

import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

function App(props) {
  // 1. Lo stato viene gestito con useState
  const [settings, setSettings] = useState({ '/': [] });
  const [titles, setTitles] = useState({});
  const [active, setActive] = useState(0);

  // 2. La logica del costruttore viene spostata in useEffect per essere eseguita solo una volta
  useEffect(() => {
    const rootEl = document.getElementById('root');
    if (!rootEl) return;

    const settingsAttr = rootEl.getAttribute('data-settings');
    if (settingsAttr) {
      try {
        setSettings(JSON.parse(settingsAttr));
      } catch (e) {
        console.error('Failed to load settings');
      }
    }

    const titlesAttr = rootEl.getAttribute('data-titles');
    if (titlesAttr) {
      try {
        setTitles(JSON.parse(titlesAttr));
      } catch (e) {
        console.error('Failed to load titles');
      }
    }
  }, []);

  // sync data in form field
  useEffect(() => {
    const field = document.getElementById('form-widgets-menu_tabs_json');
    if (field) {
      field.value = JSON.stringify(settings);
    }
  }, [settings]);

  const translate = (key, defaultMessage) =>
    props.translations[key] || defaultMessage;

  const onDragEnd = (item) => (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = active.id;
      const newIndex = over.id;
      console.log('prima: ', settings[item]);
      setSettings({
        ...settings,
        [item]: arrayMove(settings[item], oldIndex, newIndex),
      });
      console.log('dopo: ', settings[item]);
    }
  };

  const removeMenuItem = (item) => (idx) => {
    setSettings({
      ...settings,
      [item]: settings[item]
        .slice(0, idx)
        .concat(settings[item].slice(idx + 1)),
    });
  };

  const updateMenuItem = (item) => (idx, key, value) => {
    setSettings({
      ...settings,
      [item]: settings[item]
        .slice(0, idx)
        .concat([
          {
            ...settings[item][idx],
            [key]: value,
          },
        ])
        .concat(settings[item].slice(idx + 1)),
    });
  };

  const addMenuItem = (item) => {
    setSettings({
      ...settings,
      [item]: settings[item].concat([
        {
          tab_title: 'New',
          navigation_folder: '',
          additional_columns: '',
          simple_link: '',
          condition: 'python: True',
        },
      ]),
    });
  };

  const findFreeIndex = (idx) =>
    settings.hasOwnProperty(`/new${idx}`) ? findFreeIndex(idx + 1) : idx;

  const addNewMenu = () => {
    const newIdx = Object.keys(settings).length;
    const freeIdx = findFreeIndex(newIdx);
    setSettings({
      ...settings,
      [`/new${freeIdx}`]: [
        {
          tab_title: 'New',
          navigation_folder: '',
          additional_columns: '',
          simple_link: '',
          condition: 'python: True',
        },
      ],
    });
    setTitles({
      ...titles,
      [`/new${freeIdx}`]: `/new${freeIdx}`,
    });
    setActive(newIdx);
  };

  const removeMenu = (menu) => {
    const { [menu]: deletedSetting, ...remainingSettings } = settings;
    const { [menu]: deletedTitle, ...remainingTitles } = titles;
    setSettings(remainingSettings);
    setTitles(remainingTitles);
    setActive(0);
  };

  return (
    <div className="custom-settings-editor">
      <NavBar
        settings={settings}
        active={active}
        titles={titles}
        setActive={setActive}
        addNewMenu={addNewMenu}
        translate={translate}
      />
      {Object.keys(settings).map((item, idx) => {
        const menuId = titles[item] || item;
        const idToUse = menuId
          .replace(/\//g, '')
          .replace(/\s/g, '-')
          .toLowerCase();
        return (
          <fieldset
            id={`menu-${idToUse}`}
            key={`menu-${idToUse}`}
            role="tabpanel"
            className={active === idx ? 'active' : ''}
          >
            <legend>{menuId}</legend>
            <div className="tab-content">
              <label className="path-label">
                <span>{translate('path_label', 'Path')}</span>
                <input
                  type="text"
                  defaultValue={item}
                  name={`path-${idToUse}`}
                />
              </label>
              <div className="menu-configuration">
                <DndContext
                  collisionDetection={closestCenter}
                  onDragEnd={onDragEnd(item)}
                >
                  <SortableList
                    key={`conf-${idToUse}`}
                    portalUrl={props.portalUrl}
                    menuId={idToUse}
                    translate={translate}
                    items={settings[item]}
                    removeItemFromThisMenu={removeMenuItem(item)}
                    updateItemInThisMenu={updateMenuItem(item)}
                  />
                </DndContext>
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => addMenuItem(item)}
                >
                  {translate('add_menu_item', 'Add item')}
                </button>
                {idx > 0 && (
                  <div className="remove-menu-wrapper">
                    <button
                      type="button"
                      className="btn btn-danger remove-menu-button"
                      onClick={() => removeMenu(item)}
                    >
                      {translate('remove_menu', 'Remove this menu')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}

// Le props di default si definiscono fuori dal componente
App.defaultProps = {
  portalUrl: '',
  translations: {},
};

export default App;
