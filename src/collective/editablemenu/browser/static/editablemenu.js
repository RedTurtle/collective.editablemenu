(function($) {
  $(document).ready(function() {
    $('a.menuTabLink').blur(function(e) {
      var tabid = $(this).data().tabid;
      var submenu_links = $('.globalnavWrapper .submenu-' + tabid + ' a');
      if (submenu_links.length !== 0) {
        e.preventDefault();
        //set the focus to first element in the submenu
        $(submenu_links[0]).focus();
        return;
      }
    });
    $('a.menuTabLink').click(function(e) {
      e.preventDefault();
      var $this = $(this);
      var tabid = $this.data().tabid;
      var container = $this.parent();
      if (container.hasClass("tabOpen")) {
        //close the submenu
        container.removeClass("tabOpen");
        $(".globalnavWrapper #submenu-details").slideUp(function() {
            $(".globalnavWrapper #submenu-details").remove();
          });
        return;
      }
      //update open class
      $(".tabOpen").each(function() {
        $(this).removeClass("tabOpen");
      });
      container.addClass("tabOpen");
      if (tabid === undefined) {
        return;
      }
      var absolute_url = $('base').attr('href');
      $.get(absolute_url + "/@@submenu_detail_view?tab_id=" + tabid, function(data) {
        var result_html = $('<div id="submenu-details" class="submenu-' + tabid +'"></div>').html(data);
        if ($(result_html).children().length === 0) {
          //no results.
          return;
        }
        if ($(".globalnavWrapper #submenu-details").length !== 0) {
          $(".globalnavWrapper #submenu-details").remove();
          $(".globalnavWrapper").append(result_html);
        }
        else {
          $(".globalnavWrapper").append(result_html);
          $(".globalnavWrapper #submenu-details").hide().slideDown();
        }
        // var submenu_links = $(".globalnavWrapper #submenu-details a");
        // if (submenu_links.length !== 0) {
          //set the focus to first element in the submenu
          //$(submenu_links[0]).focus();
        // }
      });
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
