// js/widget.js

import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom/client';

// Importa il componente React principale che hai spostato
import App from './widget-react/App'; // Assicurati che il percorso sia corretto

// Questo sostituisce la vecchia funzione widget.app()
function initializeReactWidget(portalUrl, translations) {
  const container = document.getElementById(
    'form-widgets-menu_tabs_json-editor'
  );
  if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <App portalUrl={portalUrl} translations={translations} />
      </React.StrictMode>
    );
  }
}

$(function() {
  const portalUrl = document.body.dataset.portalUrl || '';
  let translations = {};

  $.getJSON(
    portalUrl.concat('/plonejsi18n?domain=collective.editablemenu.widget')
  )
    .done(function(data) {
      if (data) {
        translations = data;
      }
    })
    .always(function() {
      // Inizializza l'app React
      initializeReactWidget(portalUrl, translations);
    });
});
