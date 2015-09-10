(function($) {
  $(document).ready(function() {
    $('a.menuTabLink').click(function(e) {
      e.preventDefault();
      var $this = $(this);
      var tabid = $this.data().tabid;
      var container = $this.parent();
      if (container.hasClass("tabOpen")) {
        //close the submenu
        container.removeClass("tabOpen");
        $(".globalnavWrapper #submenu-details").slideUp();
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
      $.get(absolute_url + "@@submenu_detail_view?tab_id=" + tabid, function(data) {
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
      });
    });
    $('.globalnavWrapper').on('click', 'a.closeSubmenuLink', function(e) {
      e.preventDefault();
      $(".globalnavWrapper #submenu-details").slideUp();
    });
  });
})(jQuery);
