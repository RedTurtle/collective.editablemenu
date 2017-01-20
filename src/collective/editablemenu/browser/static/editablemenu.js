(function($) {
  $(document).ready(function() {
    $(document).click(function(event) {
      if(!$(event.target).closest('.globalnavWrapper').length) {
        $(".globalnavWrapper #submenu-details").slideUp();
        $(".tabOpen").removeClass("tabOpen");
      }
    });
    //$('a.menuTabLink').blur(function(e) {
      /*when a menutab link loses the focus, set the focus to the first
      submenu link. Except if the event is a "close menu" event.
      */
      //if ($(e.relatedTarget).attr('class') === 'closeSubmenuLink') {
        //$(this).focus();
        //return;
      //}
      //var tabid = $(this).data().tabid;
      //if (tabid !== undefined) {
        //var submenu_links = $('.globalnavWrapper .submenu-' + tabid + ' a');
        //if ((submenu_links.length !== 0) && ($(".globalnavWrapper #submenu-details").is(":visible"))) {
          //e.preventDefault();
          ////set the focus to first element in the submenu
          //$(submenu_links[0]).focus();
          //return;
        //}
      //}
    //});
    $('a.menuTabLink').click(function(e) {
      if ($(e.currentTarget).hasClass('clickandgo')){
          return true;
      }
      e.preventDefault();
      var $this = $(this);
      var tabid = $this.data().tabid;
      var container = $this.parent();
      var submenu = $(".globalnavWrapper #submenu-details");
      if (tabid === undefined) {
        return;
      }
      if (container.hasClass("tabOpen")) {
        //close the submenu
        $(".tabOpen").removeClass("tabOpen");
        submenu.slideUp();
        return;
      }
      //else, we need to open a menu
      $(".tabOpen").removeClass("tabOpen");
      container.addClass("tabOpen");
      if (submenu.length === 1) {
        submenu_tabid = parseInt(submenu.attr('class').slice(8), 10);
        if (submenu_tabid === tabid) {
          //we reopen the already loaded submenu
          submenu.slideDown();
          return;
        }
      }
      var baseUrl = $('body').data().baseUrl;
      if (!baseUrl) {
        //plone4
        baseUrl = portal_url;
      }
      // var baseUrl = portal_url ? portal_url : $('body').data().baseUrl;
      $.get(baseUrl + "/@@submenu_detail_view?tab_id=" + tabid, function(data) {
        var result_html = $('<div id="submenu-details" class="submenu-' + tabid +'" style="display: none;"></div>').html(data);
        if ($(result_html).children().length === 0) {
          //no results.
          return;
        }
        if (submenu.length !== 0) {
          //we need to remove old submenu and replace with new
          if (submenu.is(":visible")) {
            submenu.fadeOut("fast").remove();
            //$(".globalnavWrapper").append(result_html);
            container.append(result_html);
            $(".globalnavWrapper #submenu-details").fadeIn();
          }
          else {
            submenu.remove();
            //$(".globalnavWrapper").append(result_html);
            container.append(result_html);
            $(".globalnavWrapper #submenu-details").slideDown();
          }
        }
        else {
          //$(".globalnavWrapper").append(result_html);
          container.append(result_html);
          $(".globalnavWrapper #submenu-details").slideDown();
        }

        // var submenu_links = $(".globalnavWrapper #submenu-details a");
        // if (submenu_links.length !== 0) {
          //set the focus to first element in the submenu
          //$(submenu_links[0]).focus();
        // }
      });
    });
    $('#portal-top').on('click', '.submenuDetailsContent a', function(e) {
      $(this).focus();
    });
    $('.globalnavWrapper').on('click', 'a.closeSubmenuLink', function(e) {
      e.preventDefault();
      $(".tabOpen").each(function() {
        $(this).removeClass("tabOpen");
      });
      $(".globalnavWrapper #submenu-details").slideUp();
      var parent = $($(this).parents("#submenu-details"));
      if (parent.length === 0) {
        return;
      }
      // the class starts with "submenu-"
      var link_id = parent.attr("class").slice(8);
      var focus_link = $('*[data-tabid="' + link_id + '"]');
      if (focus_link.length === 1) {
        $(focus_link).focus();
      }
    });
  });
})(jQuery);
