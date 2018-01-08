require(['jquery', 'react-widget'], function($, widget) {
  $(function() {
    var portalUrl = $('body').data('portalUrl');
    var translations = {};
    $.getJSON(
      portalUrl.concat('/plonejsi18n?domain=collective.editablemenu.widget')
    )
      .done(function(data) {
        if (data) {
          translations = data;
        }
      })
      .always(function() {
        widget.app(portalUrl, translations);
      });

    // SAVE
    function handleSave() {
      var settings = {};
      $('.custom-settings-editor fieldset').each(function() {
        var $section = $(this);
        var section_name = $section.find('.tab-content > label > input').val();
        if (section_name) {
          settings[section_name] = [];
          $section.find('.menu-configuration > ul > li').each(function() {
            var $item = $(this);
            settings[section_name].push({
              navigation_folder: $item.find('input[name^="navfolder"]').val(),
              simple_link: $item.find('input[name^="simple"]').val(),
              tab_title: $item.find('textarea').val(),
              additional_columns: $item.find('input[name^="additional"]').val(),
              condition: $item.find('input[name^="condition"]').val(),
            });
          });
        }
      });
      $('#form-widgets-menu_tabs_json').text(JSON.stringify(settings));
    }
    $('#form-buttons-save').click(handleSave);
  });
});
