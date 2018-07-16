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
  menuId,
  portalUrl,
  translate,
}) => {
  const idFromName = tab_title
    .replace(/\s/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase();
  const idToUse = tab_title === 'New' ? `new-${idx}` : idFromName;
  const collapse_id = `collapse-${menuId}-${idToUse}`;
  const heading_id = `heading-${menuId}-${idToUse}`;

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
              alt={translate('remove_menu_item', 'Remove this menu entry')}
              src={`${portalUrl}/++plone++collective.editablemenu/delete_tab.png`}
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
              <p className="title">
                {translate('tab_title_label', 'Tab title')}
              </p>
              <p className="help">
                {translate('tab_title_help', 'Insert the title of this tab.')}
              </p>
              <textarea
                value={tab_title}
                name={`tabtitle-${menuId}-${idx}`}
                key={`title-${menuId}-${idx}`}
                onChange={e =>
                  updateItemInThisMenu(idx, 'tab_title', e.target.value)
                }
              />
            </label>
            <label>
              <p className="title">
                {translate('navigation_folder_label', 'Navigation folder')}
              </p>
              <p className="help">
                {translate(
                  'navigation_folder_help',
                  'Insert a path of the folder that should list its contents in the menu.'
                )}
              </p>
              <input
                type="text"
                value={navigation_folder}
                name={`navfolder-${menuId}-${idx}`}
                key={`navfolder-${menuId}-${idx}`}
                onChange={e =>
                  updateItemInThisMenu(idx, 'navigation_folder', e.target.value)
                }
              />
            </label>
            <label>
              <p className="title">
                {translate('additional_columns_label', 'Additional columns')}
              </p>
              <p className="help">
                {translate(
                  'additional_columns_help',
                  'Insert a path of the folder that contains pages for additional static columns.'
                )}
              </p>
              <input
                type="text"
                value={additional_columns}
                name={`additional-${menuId}-${idx}`}
                key={`additional-${menuId}-${idx}`}
                onChange={e =>
                  updateItemInThisMenu(
                    idx,
                    'additional_columns',
                    e.target.value
                  )
                }
              />
            </label>
            <label>
              <p className="title">
                {translate('simple_link_label', 'Simple link')}
              </p>
              <p className="help">
                {translate(
                  'simple_link_help',
                  'Insert a path of an element; this will override previous settings and you will see just a single link in menu without submenu.'
                )}
              </p>
              <input
                type="text"
                value={simple_link}
                name={`simple-${menuId}-${idx}`}
                key={`simple-${menuId}-${idx}`}
                onChange={e =>
                  updateItemInThisMenu(idx, 'simple_link', e.target.value)
                }
              />
            </label>
            <label>
              <p className="title">
                {translate('condition_label', 'Condition')}
              </p>
              <p className="help">
                {translate(
                  'condition_help',
                  'Insert condition (you can use variables like object, portal, request, here, member... See complete list here: http://docs.plone.org/develop/plone/functionality/expressions.html#expression-variables)'
                )}
              </p>
              <input
                type="text"
                value={condition}
                name={`condition-${menuId}-${idx}`}
                key={`condition-${menuId}-${idx}`}
                onChange={e =>
                  updateItemInThisMenu(idx, 'condition', e.target.value)
                }
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
  menuId: 'menu-new-x',
  portalUrl: '',
  translate: (key, defaultMessage) => defaultMessage,
};

export default SortableElement(MenuItem);
