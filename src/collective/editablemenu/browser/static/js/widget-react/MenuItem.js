// MenuItem.js
// ✅ 1. Rimuovi useState, non serve più qui
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash, GripVertical } from 'react-bootstrap-icons';

// ✅ 2. Aggiungi le nuove props `isOpen` e `onToggle`
const MenuItem = ({
  idx,
  tab_title,
  navigation_folder,
  additional_columns,
  simple_link,
  condition,
  intro_text,
  section_link,
  removeItemFromThisMenu,
  updateItemInThisMenu,
  menuId,
  portalUrl,
  translate,
  isOpen,
  onToggle,
}) => {
  // ✅ 3. Rimuovi lo stato locale e la funzione handleToggle interna

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: idx });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const idFromName = tab_title
    .replace(/\s/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase();
  const idToUse = tab_title === 'New' ? `new-${idx}` : idFromName;
  const collapse_id = `collapse-${menuId}-${idToUse}`;

  return (
    <div className="accordion-item" ref={setNodeRef} style={style}>
      <h2 className="accordion-header">
        <button
          {...attributes}
          {...listeners}
          className="btn btn-outline-primary drag-handle"
          aria-label="Drag to reorder"
          type="button"
        >
          <GripVertical />
        </button>
        <button
          type="button"
          className="btn btn-danger remove-item-button"
          onClick={() => removeItemFromThisMenu(idx)}
          aria-label={translate('remove_menu_item', 'Remove this menu entry')}
        >
          <Trash />
        </button>
        <button
          className={`accordion-button ${!isOpen ? 'collapsed' : ''}`}
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={collapse_id}
        >
          {tab_title}
        </button>
      </h2>
      <div
        className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
        id={collapse_id}
        data-bs-parent={`#accordion-${menuId}`}
      >
        <div className="accordion-body">
          <div className="accordion-body">
            <div className="mb-3">
              <label
                htmlFor={`tabtitle-${menuId}-${idx}`}
                className="form-label"
              >
                {translate('tab_title_label', 'Tab title')}
              </label>
              <textarea
                className="form-control"
                value={tab_title}
                name={`tabtitle-${menuId}-${idx}`}
                id={`tabtitle-${menuId}-${idx}`}
                key={`title-${menuId}-${idx}`}
                onChange={(e) =>
                  updateItemInThisMenu(idx, 'tab_title', e.target.value)
                }
              />
              <div id={`tabtitle-${menuId}-${idx}-help`} className="form-text">
                {translate('tab_title_help', 'Insert the title of this tab.')}
              </div>
            </div>
            <div className="mb-3">
              <label
                htmlFor={`navfolder-${menuId}-${idx}`}
                className="form-label"
              >
                {translate('navigation_folder_label', 'Navigation folder')}
              </label>
              <input
                className="form-control"
                type="text"
                value={navigation_folder}
                name={`navfolder-${menuId}-${idx}`}
                id={`navfolder-${menuId}-${idx}`}
                key={`navfolder-${menuId}-${idx}`}
                onChange={(e) =>
                  updateItemInThisMenu(idx, 'navigation_folder', e.target.value)
                }
              />
              <div id={`navfolder-${menuId}-${idx}-help`} className="form-text">
                {translate(
                  'navigation_folder_help',
                  'Insert a path of the folder that should list its contents in the menu.'
                )}
              </div>
            </div>
            <div className="mb-3">
              <label
                htmlFor={`additional-${menuId}-${idx}`}
                className="form-label"
              >
                {translate('additional_columns_label', 'Additional columns')}
              </label>
              <input
                type="text"
                className="form-control"
                value={additional_columns}
                name={`additional-${menuId}-${idx}`}
                key={`additional-${menuId}-${idx}`}
                id={`additional-${menuId}-${idx}`}
                onChange={(e) =>
                  updateItemInThisMenu(
                    idx,
                    'additional_columns',
                    e.target.value
                  )
                }
              />
              <div
                id={`additional-${menuId}-${idx}-help`}
                className="form-text"
              >
                {translate(
                  'additional_columns_help',
                  'Insert a path of the folder that contains pages for additional static columns.'
                )}
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor={`simple-${menuId}-${idx}`} className="form-label">
                {translate('simple_link_label', 'Simple link')}
              </label>
              <input
                className="form-control"
                type="text"
                value={simple_link}
                name={`simple-${menuId}-${idx}`}
                id={`simple-${menuId}-${idx}`}
                key={`simple-${menuId}-${idx}`}
                onChange={(e) =>
                  updateItemInThisMenu(idx, 'simple_link', e.target.value)
                }
              />
              <div id={`simple-${menuId}-${idx}-help`} className="form-text">
                {translate(
                  'simple_link_help',
                  'Insert a path of an element; this will override previous settings and you will see just a single link in menu without submenu.'
                )}
              </div>
            </div>
            <div className="mb-3">
              <label
                htmlFor={`condition-${menuId}-${idx}`}
                className="form-label"
              >
                {translate('condition_label', 'Condition')}
              </label>
              <input
                className="form-control"
                type="text"
                value={condition}
                name={`condition-${menuId}-${idx}`}
                id={`condition-${menuId}-${idx}`}
                key={`condition-${menuId}-${idx}`}
                onChange={(e) =>
                  updateItemInThisMenu(idx, 'condition', e.target.value)
                }
              />
              <div id={`condition-${menuId}-${idx}-help`} className="form-text">
                {translate(
                  'condition_help',
                  'Insert condition (you can use variables like object, portal, request, here, member... See complete list here: http://docs.plone.org/develop/plone/functionality/expressions.html#expression-variables)'
                )}
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor={`intro-${menuId}-${idx}`} className="form-label">
                {translate('section_intro_label', 'Submenu heading')}
              </label>
              <input
                className="form-control"
                type="text"
                value={intro_text}
                name={`intro-${menuId}-${idx}`}
                id={`intro-${menuId}-${idx}`}
                key={`intro-${menuId}-${idx}`}
                onChange={(e) =>
                  updateItemInThisMenu(idx, 'intro_text', e.target.value)
                }
              />
              <div id={`intro-${menuId}-${idx}-help`} className="form-text">
                {translate(
                  'section_intro_help',
                  'Text shown at the top of the submenu when using navigation folder based menu generation.'
                )}
              </div>
            </div>
            <div className="mb-3">
              <label
                htmlFor={`section-link-${menuId}-${idx}`}
                className="form-label"
              >
                {translate('section_link_label', 'Section link text')}
              </label>
              <input
                className="form-control"
                type="text"
                value={section_link}
                name={`section-link-${menuId}-${idx}`}
                id={`section-link-${menuId}-${idx}`}
                key={`section-link-${menuId}-${idx}`}
                onChange={(e) =>
                  updateItemInThisMenu(idx, 'section_link', e.target.value)
                }
              />
              <div
                id={`section-link-${menuId}-${idx}-help`}
                className="form-text"
              >
                {translate(
                  'section_link_help',
                  'Text shown in the link at the bottom of the submenu when using navigation folder based menu generation.'
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

MenuItem.defaultProps = {
  // ... le tue defaultProps
};

export default MenuItem;
