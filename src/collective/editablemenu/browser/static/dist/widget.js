require(['jquery', 'pat-registry'], function($, Registry) {
  $(function() {
    // I thought these could have been useful, but actually they look
    // like they are not. I'm leaving these here for now, just in case...
    //
    // function checkMenuItem(item) {
    //   return (
    //     typeof item === 'object' &&
    //     item.hasOwnProperty('additional_columns') &&
    //     item.hasOwnProperty('condition') &&
    //     item.hasOwnProperty('navigation_folder') &&
    //     item.hasOwnProperty('simple_link') &&
    //     item.hasOwnProperty('tab_title')
    //   );
    // }

    // function addMenuItem(menu, item) {
    //   if (!menu || typeof menu !== 'string' || !checkMenuItem(item)) {
    //     return;
    //   }
    //   var json_settings = $('#form-widgets-menu_tabs_json').text();
    //   var settings;
    //   try {
    //     settings = JSON.parse(json_settings);
    //   } catch (e) {
    //     settings = {};
    //   }
    //   if (!settings.hasOwnProperty(menu)) {
    //     settings[menu] = [];
    //   }
    //   settings[menu].push(item);
    //   $('#form-widgets-menu_tabs_json').text(JSON.stringify(settings));
    // }

    function handleSave() {
      var settings = {};
      $('.custom-settings-editor fieldset.autotoc-section').each(function() {
        var $section = $(this);
        var section_name = $section.find('.tab-content > label > input').val();
        if (section_name) {
          settings[section_name] = [];
          $section.find('.menu-configuration > ul > li').each(function() {
            var $item = $(this);
            settings[section_name].push({
              navigation_folder: $item.find('input[name^="navfolder"]').val(),
              simple_link: $item.find('input[name^="simple"]').val(),
              tab_title: $item.find('input[name^="title"]').val(),
              additional_columns: $item.find('input[name^="additional"]').val(),
              condition: $item.find('input[name^="condition"]').val(),
            });
          });
        }
      });
      $('#form-widgets-menu_tabs_json').text(JSON.stringify(settings));
    }
    $('#form-buttons-save').click(handleSave);

    function titleUpdated(evt) {
      $(evt.target)
        .closest('.panel')
        .find('.panel-heading span')
        .text(evt.target.value);
    }
    $('.custom-settings-editor').on(
      'keyup',
      'input[name^="title"]',
      titleUpdated
    );

    function findNextNewIndex() {
      var found = false;
      var index = 0;
      while (!found) {
        if ($('#heading-new-'.concat(index)).length) {
          index = index + 1;
        } else {
          found = true;
        }
      }
      return index;
    }

    function craftNewMenuItem() {
      var index = findNextNewIndex();
      var item = $('#panel-group-template > div').clone(true);
      item
        .find('#heading-new a')
        .attr('href', '#collapse-new-'.concat(index))
        .attr('aria-controls', 'collapse-new-'.concat(index));
      item.find('#heading-new').attr('id', 'heading-new-'.concat(index));
      item
        .find('#collapse-new')
        .attr('aria-labelledby', 'heading-new-'.concat(index))
        .attr('id', 'collapse-new-'.concat(index));
      item
        .find('input[name^="title-new"]')
        .attr('name', 'title-new-'.concat(index));
      item
        .find('input[name^="navfolder-new"]')
        .attr('name', 'navfolder-new-'.concat(index));
      item
        .find('input[name^="additional-new"]')
        .attr('name', 'additional-new-'.concat(index));
      item
        .find('input[name^="simple-new"]')
        .attr('name', 'simple-new-'.concat(index));
      item
        .find('input[name^="condition-new"]')
        .attr('name', 'condition-new-'.concat(index));
      return $('<li></li>').append(item);
    }

    function addItemButtonClick(evt) {
      evt.preventDefault();
      var new_item = craftNewMenuItem();
      $('.autotoc-section.active ul').append(new_item);
    }
    $('#add-menu-item-button').click(addItemButtonClick);

    function removeItem(evt) {
      evt.preventDefault();
      $(evt.target)
        .closest('li')
        .remove();
    }
    $('.custom-settings-editor').on('click', '.remove-item-button', removeItem);
  });
});

define("js/widget.js", function(){});


//# sourceMappingURL=widget.js.map