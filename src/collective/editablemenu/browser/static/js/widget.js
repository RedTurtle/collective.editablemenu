require(['jquery', 'react-widget'], function($, widget) {
  $(function() {
    widget.app();
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

    // FORM TAB CONTROL
    // function handleTabControl(evt) {
    //   evt.preventDefault();
    //   var $controller = $(evt.currentTarget);
    //   if (!$controller.hasClass('active')) {
    //     $('.menus-nav a.tab-control').removeClass('active');
    //     $('.custom-settings-editor fieldset').removeClass('active');
    //     $controller.addClass('active');
    //     $($controller.attr('href')).addClass('active');
    //   }
    // }
    // $('.custom-settings-editor').on(
    //   'click',
    //   '.menus-nav a.tab-control',
    //   handleTabControl
    // );

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

    // DYNAMIC ITEM TITLE
    // function titleUpdated(evt) {
    //   $(evt.target)
    //     .closest('.panel')
    //     .find('.panel-heading span')
    //     .text(evt.target.value);
    // }
    // $('.custom-settings-editor').on(
    //   'keyup',
    //   'input[name^="title"]',
    //   titleUpdated
    // );

    // ADD NEW MENU ITEM
    // function findNextNewItemIndex() {
    //   var found = false;
    //   var index = 0;
    //   while (!found) {
    //     if ($('#heading-new-'.concat(index)).length) {
    //       index = index + 1;
    //     } else {
    //       found = true;
    //     }
    //   }
    //   return index;
    // }

    // function craftNewMenuItem() {
    //   var index = findNextNewItemIndex();
    //   var item = $('#panel-group-template > div').clone(true);
    //   item
    //     .find('#heading-new a')
    //     .attr('href', '#collapse-new-'.concat(index))
    //     .attr('aria-controls', 'collapse-new-'.concat(index));
    //   item.find('#heading-new').attr('id', 'heading-new-'.concat(index));
    //   item
    //     .find('#collapse-new')
    //     .attr('aria-labelledby', 'heading-new-'.concat(index))
    //     .attr('id', 'collapse-new-'.concat(index));
    //   item
    //     .find('input[name^="title-new"]')
    //     .attr('name', 'title-new-'.concat(index));
    //   item
    //     .find('input[name^="navfolder-new"]')
    //     .attr('name', 'navfolder-new-'.concat(index));
    //   item
    //     .find('input[name^="additional-new"]')
    //     .attr('name', 'additional-new-'.concat(index));
    //   item
    //     .find('input[name^="simple-new"]')
    //     .attr('name', 'simple-new-'.concat(index));
    //   item
    //     .find('input[name^="condition-new"]')
    //     .attr('name', 'condition-new-'.concat(index));
    //   return $('<li></li>').append(item);
    // }

    // function addItemButtonClick(evt) {
    //   evt.preventDefault();
    //   var new_item = craftNewMenuItem();
    //   var $ul = $('.custom-settings-editor fieldset.active ul');
    //   $ul.append(new_item);
    // }
    // $('.custom-settings-editor').on(
    //   'click',
    //   '.add-menu-item-button',
    //   addItemButtonClick
    // );

    // REMOVE MENU ITEM
    // function removeItem(evt) {
    //   evt.preventDefault();
    //   $(evt.target)
    //     .closest('li')
    //     .remove();
    // }
    // $('.custom-settings-editor').on('click', '.remove-item-button', removeItem);

    // ADD NEW MENU
    // function findNextNewMenuIndex() {
    //   var found = false;
    //   var index = 0;
    //   while (!found) {
    //     if ($('input[name="path-new-'.concat(index).concat('"]')).length) {
    //       index = index + 1;
    //     } else {
    //       found = true;
    //     }
    //   }
    //   return index;
    // }

    // function findNextNewMenuPath(basePath) {
    //   var numToAppend = 0;
    //   var path = basePath || '/new';
    //   var found = false;
    //   while (!found) {
    //     var pathExists = false;
    //     $('.custom-settings-editor input[name^="path"]').each(function() {
    //       if ($(this).val() === path.concat(numToAppend)) {
    //         pathExists = true;
    //         return false;
    //       }
    //     });
    //     if (pathExists) {
    //       numToAppend = numToAppend + 1;
    //     } else {
    //       found = true;
    //     }
    //   }
    //   return path.concat(numToAppend);
    // }

    // function craftNewMenuLink(index) {
    //   var item = $('#section-fieldset-template > a').clone(true);
    //   item
    //     .attr('aria-controls', 'menu-new-'.concat(index))
    //     .attr('href', '#menu-new-'.concat(index));
    //   return item;
    // }

    // function craftNewMenu(index) {
    //   var item = $('#section-fieldset-template > fieldset').clone(true);
    //   var path = findNextNewMenuPath(item.find('input[name="path-new"]').val());
    //   item
    //     .find('input[name="path-new"]')
    //     .val(path)
    //     .attr('name', 'path-new-'.concat(index));
    //   item.find('.menu-configuration > ul').addClass('pat-sortable');
    //   item.attr('id', 'menu-new-'.concat(index));
    //   return item;
    // }

    // function addMenuButtonClick(evt) {
    //   evt.preventDefault();
    //   var index = findNextNewMenuIndex();
    //   var new_menu = craftNewMenu(index);
    //   var new_link = craftNewMenuLink(index);
    //   $('.menus-nav a').removeClass('active');
    //   $('.menus-nav').append(new_link);
    //   $('.custom-settings-editor fieldset').removeClass('active');
    //   $('.custom-settings-editor').append(new_menu);
    // }
    // $('.custom-settings-editor').on(
    //   'click',
    //   '.add-menu-button',
    //   addMenuButtonClick
    // );
  });
});
