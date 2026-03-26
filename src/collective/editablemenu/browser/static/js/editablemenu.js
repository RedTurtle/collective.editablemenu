import $ from 'jquery';
import mousetrap from 'mousetrap';
// import '../sass/editablemenu.scss';

// In Plone 6, il codice viene eseguito dopo il caricamento del DOM di default.
// Ma usare $(function() { ... }) è ancora una buona pratica per chiarezza.
$(function() {
  const customEvents = {
    closed: 'editablemenu.submenu.closed',
    loaded: 'editablemenu.submenu.loaded',
    opened: 'editablemenu.submenu.opened',
  };

  // Chiude il sottomenù se si clicca fuori dalla navigazione
  $(document).on('click', function(event) {
    if (!$(event.target).closest('#mainnavigation').length) {
      $('#mainnavigation #submenu-details').slideUp();
      $('.tabOpen a').attr('aria-expanded', false);
      $('.tabOpen').removeClass('tabOpen');
    }
  });

  // Associa il tasto 'esc' per chiudere il sottomenù
  mousetrap.bind('esc', function() {
    if ($('.tabOpen').length > 0) {
      $('.tabOpen a').attr('aria-expanded', false);
      $('.tabOpen a.menuTabLink').trigger(customEvents.closed);
      $('.tabOpen').removeClass('tabOpen');
      $('#mainnavigation #submenu-details').slideUp();
    }
  });

  $('a.menuTabLink').on('click', function(e) {
    if ($(e.currentTarget).hasClass('clickandgo')) {
      return true;
    }
    e.preventDefault();
    const $this = $(this);
    const tabid = $this.data().tabid;
    const container = $this.parent();
    const submenu = $('#mainnavigation #submenu-details');
    if (tabid === undefined) {
      return;
    }
    if (container.hasClass('tabOpen')) {
      // Chiude il sottomenù
      $('.tabOpen a').attr('aria-expanded', false);
      $('.tabOpen').removeClass('tabOpen');
      submenu.slideUp(400, function() {
        $this.trigger(customEvents.closed);
      });
      return;
    }
    // Altrimenti, apre un menù
    $('.tabOpen a').attr('aria-expanded', false);
    $('.tabOpen').removeClass('tabOpen');
    container.addClass('tabOpen');
    container.find('a').attr('aria-expanded', true);

    if (submenu.length === 1) {
      const submenu_tabid = parseInt(submenu.attr('class').slice(8), 10);
      if (submenu_tabid === tabid) {
        // Riapre lo stesso sottomenù già caricato
        submenu.slideDown(400, function() {
          $this.trigger(customEvents.opened);
        });
        return;
      }
    }

    // [MODIFICA CHIAVE] Ottiene il baseUrl in modo moderno
    const baseUrl = document.body.dataset.baseUrl || '';
    $.get(baseUrl + '/@@submenu_detail_view?tab_id=' + tabid, function(data) {
      const scriptRegex = /<script.*?id="protect-script".*?<\/script>/g;
      let prevData, newData = data;
      do {
        prevData = newData;
        newData = newData.replace(scriptRegex, '');
      } while (newData !== prevData);
      const $oldSubmenu = $('#mainnavigation #submenu-details');

      // Se il contenuto ricevuto è vuoto, non fare nulla e chiudi il menu
      if (!newData.trim()) {
        if ($oldSubmenu.length > 0) {
          $oldSubmenu.slideUp(200, function() {
            $(this).remove();
          });
        }
        $('.tabOpen a').attr('aria-expanded', false);
        $('.tabOpen').removeClass('tabOpen');
        $this.trigger(customEvents.loaded);
        return;
      }

      // 1. Crea il nuovo sottomenù come oggetto jQuery, ma tienilo nascosto
      //    e fuori dal DOM per ora.
      const $newSubmenu = $(
        `<div id="submenu-details" class="submenu-${tabid}">${newData}</div>`
      ).hide();

      // 2. Controlla se un sottomenù è GIA' aperto
      if ($oldSubmenu.length > 0) {
        // Se sì, chiudilo con un'animazione.
        // Esegui il resto del codice SOLO QUANDO l'animazione è finita.
        $oldSubmenu.slideUp(200, function() {
          // 3. ORA che è nascosto, rimuovilo dal DOM
          $(this).remove();

          // 4. Aggiungi il nuovo sottomenù e mostralo con un'animazione
          container.append($newSubmenu);
          $newSubmenu.slideDown(400, function() {
            $this.trigger(customEvents.loaded);
            $this.trigger(customEvents.opened);
          });
        });
      } else {
        // 5. Se nessun sottomenù era aperto, aggiungi semplicemente quello nuovo
        container.append($newSubmenu);
        $newSubmenu.slideDown(400, function() {
          $this.trigger(customEvents.loaded);
          $this.trigger(customEvents.opened);
        });
      }
    });
  });

  $('#portal-top').on('click', '.submenuDetailsContent a', function() {
    $(this).focus();
  });

  $('#mainnavigation').on('click', 'a.closeSubmenuLink', function(e) {
    e.preventDefault();
    const $this = $(this);
    $('.tabOpen a').attr('aria-expanded', false);
    $('.tabOpen').removeClass('tabOpen');
    $('#mainnavigation #submenu-details').slideUp(400, function() {
      $this.trigger(customEvents.closed);
    });
    const parent = $($this.parents('#submenu-details'));
    if (parent.length === 0) {
      return;
    }
    // La classe inizia con "submenu-"
    const link_id = parent.attr('class').slice(8);
    const focus_link = $('*[data-tabid="' + link_id + '"]');
    if (focus_link.length === 1) {
      $(focus_link).focus();
    }
  });
});
