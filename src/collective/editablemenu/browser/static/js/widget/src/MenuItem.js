import React from 'react';
import { SortableElement } from 'react-sortable-hoc';

const MenuItem = ({
  index,
  tab_title = '',
  navigation_folder = '',
  additional_columns = '',
  simple_link = '',
  condition = '',
}) => {
  const menu_id = tab_title.replace(/\s/, '-').toLowerCase();
  const collapse_id = `collapse-${menu_id}`;
  const heading_id = `heading-${menu_id}`;

  return (
    <li>
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
              <input type="text" value={tab_title} name={`title-${index}`} />
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
                name={`navfolder-${index}`}
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
                name={`additional-${index}`}
              />
            </label>
            <label>
              <p>Simple link</p>
              <p>
                Insert a path of an element; this will override previous
                settings and you will see just a single link in menu without
                submenu.
              </p>
              <input type="text" value={simple_link} name={`simple-${index}`} />
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
                name={`condition-${index}`}
              />
            </label>
          </div>
        </div>
      </div>
    </li>
  );
};

export default SortableElement(MenuItem);
