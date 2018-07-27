require(['jquery', 'mousetrap'], function($, mousetrap) {
  $(function() {
    var customEvents = {
      closed: 'editablemenu.submenu.closed',
      loaded: 'editablemenu.submenu.loaded',
      opened: 'editablemenu.submenu.opened',
    };

    $(document).click(function(event) {
      if (!$(event.target).closest('.globalnavWrapper').length) {
        $('.globalnavWrapper #submenu-details').slideUp();
        $('.tabOpen a').attr('aria-expanded', false);
        $('.tabOpen').removeClass('tabOpen');
      }
    });

    mousetrap.bind('esc', function() {
      if ($('.tabOpen').length > 0) {
        $('.tabOpen a').attr('aria-expanded', false);
        $('.tabOpen a.menuTabLink').trigger(customEvents.closed);
        $('.tabOpen').removeClass('tabOpen');
        $('.globalnavWrapper #submenu-details').slideUp();
      }
    });

    $('a.menuTabLink').click(function(e) {
      if ($(e.currentTarget).hasClass('clickandgo')) {
        return true;
      }
      e.preventDefault();
      var $this = $(this);
      var tabid = $this.data().tabid;
      var container = $this.parent();
      var submenu = $('.globalnavWrapper #submenu-details');
      if (tabid === undefined) {
        return;
      }
      if (container.hasClass('tabOpen')) {
        //close the submenu
        $('.tabOpen a').attr('aria-expanded', false);
        $('.tabOpen').removeClass('tabOpen');
        submenu.slideUp(400, function() {
          $this.trigger(customEvents.closed);
        });
        return;
      }
      //else, we need to open a menu
      $('.tabOpen a').attr('aria-expanded', false);
      $('.tabOpen').removeClass('tabOpen');
      container.addClass('tabOpen');
      container.find('a').attr('aria-expanded', true);
      if (submenu.length === 1) {
        var submenu_tabid = parseInt(submenu.attr('class').slice(8), 10);
        if (submenu_tabid === tabid) {
          //we reopen the already loaded submenu
          submenu.slideDown(400, function() {
            $this.trigger(customEvents.opened);
          });
          return;
        }
      }
      var baseUrl = $('body').data().baseUrl;
      $.get(baseUrl + '/@@submenu_detail_view?tab_id=' + tabid, function(data) {
        var scriptRegex = /<script.*?id="protect-script".*?<\/script>/g;
        var newData = data.replace(scriptRegex, '');
        var result_html = $(
          '<div id="submenu-details" class="submenu-' +
            tabid +
            '" style="display: none;"></div>'
        ).html(newData);
        if ($(result_html).children().length === 0) {
          //no results.
          $this.trigger(customEvents.loaded);
          return;
        }
        if (submenu.length !== 0) {
          //we need to remove old submenu and replace with new
          if (submenu.is(':visible')) {
            submenu.fadeOut('fast').remove();
            container.append(result_html);
            $('.globalnavWrapper #submenu-details').fadeIn(400, function() {
              $this.trigger(customEvents.loaded);
            });
          } else {
            submenu.remove();
            container.append(result_html);
            $('.globalnavWrapper #submenu-details').slideDown(400, function() {
              $this.trigger(customEvents.loaded);
              $this.trigger(customEvents.opened);
            });
          }
        } else {
          container.append(result_html);
          $('.globalnavWrapper #submenu-details').slideDown(400, function() {
            $this.trigger(customEvents.loaded);
            $this.trigger(customEvents.opened);
          });
        }
      });
    });
    $('#portal-top').on('click', '.submenuDetailsContent a', function() {
      $(this).focus();
    });
    $('.globalnavWrapper').on('click', 'a.closeSubmenuLink', function(e) {
      e.preventDefault();
      var $this = $(this);
      $('.tabOpen a').attr('aria-expanded', false);
      $('.tabOpen').removeClass('tabOpen');
      $('.globalnavWrapper #submenu-details').slideUp(400, function() {
        $this.trigger(customEvents.closed);
      });
      var parent = $($this.parents('#submenu-details'));
      if (parent.length === 0) {
        return;
      }
      // the class starts with "submenu-"
      var link_id = parent.attr('class').slice(8);
      var focus_link = $('*[data-tabid="' + link_id + '"]');
      if (focus_link.length === 1) {
        $(focus_link).focus();
      }
    });
  });
});
