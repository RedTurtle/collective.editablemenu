// SortableList.js
// ✅ 1. Importa useState
import React, { useState } from 'react';
import MenuItem from './MenuItem';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

const SortableList = ({
  menuId,
  portalUrl,
  translate,
  items,
  removeItemFromThisMenu,
  updateItemInThisMenu,
}) => {
  // ✅ 2. Aggiungi uno stato per tenere traccia dell'indice dell'elemento aperto
  // Inizializziamo con `null` per indicare che all'inizio sono tutti chiusi.
  const [openItemIndex, setOpenItemIndex] = useState(null);

  // ✅ 3. Crea una funzione per gestire il click
  const handleToggle = (index) => {
    // Se clicco sull'elemento già aperto, lo chiudo. Altrimenti, apro quello nuovo.
    setOpenItemIndex(openItemIndex === index ? null : index);
  };

  return (
    <SortableContext
      items={items.map((_, index) => index)}
      strategy={verticalListSortingStrategy}
    >
      {/* Bootstrap richiede che l'accordion abbia un div contenitore */}
      <div className="accordion" id={`accordion-${menuId}`}>
        {items.map((conf, conf_idx) => (
          <MenuItem
            {...conf}
            key={`${menuId}-${conf_idx}`}
            {...{
              removeItemFromThisMenu,
              updateItemInThisMenu,
              menuId,
              portalUrl,
              translate,
              idx: conf_idx,
            }}
            // ✅ 4. Passa le nuove props al componente figlio
            isOpen={openItemIndex === conf_idx} // L'elemento è aperto solo se il suo indice corrisponde a quello nello stato
            onToggle={() => handleToggle(conf_idx)} // Passa la funzione per aggiornare lo stato
          />
        ))}
      </div>
    </SortableContext>
  );
};

SortableList.defaultProps = {
  // ... le tue defaultProps
};

export default SortableList;
