import React from 'react';
import { SortableElement } from 'react-sortable-hoc';

const MenuItem = ({
  idx,
  tab_title,
  navigation_folder,
  additional_columns,
  simple_link,
  condition,
  removeItemFromThisMenu,
  updateItemInThisMenu,
}) => {
  const menu_id = tab_title.replace(/\s/, '-').toLowerCase();
  const collapse_id = `collapse-${menu_id}`;
  const heading_id = `heading-${menu_id}`;

  return (
    <li className="menu-item">
      <div className="panel panel-default">
        <div className="panel-heading" role="tab" id={heading_id}>
          <h4 className="panel-title">
            <a
              role="button"
              data-toggle="collapse"
              aria-expanded="false"
              href={`#${collapse_id}`}
              aria-controls={collapse_id}
            >
              <span>{tab_title}</span>
            </a>
          </h4>
          <button
            type="button"
            className="plone-btn plone-btn-danger remove-item-button"
            onClick={() => removeItemFromThisMenu(idx)}
          >
            <img
              alt="Remove this menu entry"
              src="++plone++collective.editablemenu/delete_tab.png"
            />
          </button>
        </div>
        <div
          className="panel-collapse collapse"
          role="tabpanel"
          id={collapse_id}
          aria-labelledby={heading_id}
        >
          <div className="panel-body">
            <label>
              <p>Tab title</p>
              <p>Insert the title of this tab.</p>
              <input
                type="text"
                value={tab_title}
                name={`title-${idx}`}
                key={`title-${idx}`}
                onChange={(e) => updateItemInThisMenu(idx, 'tab_title', e.target.value)}
              />
            </label>
            <label>
              <p>Navigation folder</p>
              <p>
                Insert a path of the folder that should list its contents in the
                menu.
              </p>
              <input
                type="text"
                value={navigation_folder}
                name={`navfolder-${idx}`}
                key={`navfolder-${idx}`}
                onChange={(e) => updateItemInThisMenu(idx, 'navigation_folder', e.target.value)}
              />
            </label>
            <label>
              <p>Additional columns</p>
              <p>
                Insert a path of the folder that contains pages for additional
                static columns.
              </p>
              <input
                type="text"
                value={additional_columns}
                name={`additional-${idx}`}
                key={`additional-${idx}`}
                onChange={(e) => updateItemInThisMenu(idx, 'additional_columns', e.target.value)}
              />
            </label>
            <label>
              <p>Simple link</p>
              <p>
                Insert a path of an element; this will override previous
                settings and you will see just a single link in menu without
                submenu.
              </p>
              <input
                type="text"
                value={simple_link}
                name={`simple-${idx}`}
                key={`simple-${idx}`}
                onChange={(e) => updateItemInThisMenu(idx, 'simple_link', e.target.value)}
              />
            </label>
            <label>
              <p>Condition</p>
              <p>
                Insert condition (you can use variables like object,portal,
                request, here, member... See complete list here:
                http://docs.plone.org/develop/plone/functionality/expressions.html#expression-variables)
              </p>
              <input
                type="text"
                value={condition}
                name={`condition-${idx}`}
                key={`condition-${idx}`}
                onChange={(e) => updateItemInThisMenu(idx, 'condition', e.target.value)}
              />
            </label>
          </div>
        </div>
      </div>
    </li>
  );
};

MenuItem.defaultProps = {
  tab_title: '',
  navigation_folder: '',
  additional_columns: '',
  simple_link: '',
  condition: '',
  removeItemFromThisMenu: () => {},
  updateItemInThisMenu: () => {},
};

export default SortableElement(MenuItem);
