# -*- coding: utf-8 -*-
from Products.Five import BrowserView
from plone import api
from collective.editablemenu import logger
from plone.memoize import view
from Products.CMFCore.interfaces import IFolderish


class MenuSupportView(BrowserView):
    """
    """

    @property
    @view.memoize
    def menu_settings(self):
        registry = "collective.editablemenu.browser.interfaces.IEditableMenuSettings.menu_tabs"
        return api.portal.get_registry_record(registry)

    def get_menu_tabs(self):
        context = self.context.aq_inner
        context_path = "/".join(context.getPhysicalPath())
        settings = self.menu_settings
        if not settings:
            return []
        results = []
        for i, tab_settings in enumerate(settings):
            tab_title = getattr(tab_settings, "tab_title", '')
            if not tab_title:
                continue
            # this text is used inside a link, so i can't use portal_transorms
            # because it wraps all inside a <p> tag.
            # I wrap every row inside a span, so they can be easily styled
            rows = ["<span>%s</span>" % x for x in tab_title.split("\r\n")]
            formatted_tab_title = "<br/>".join(rows)
            navigation_folder = self.get_navigation_folder(tab_settings)
            if not navigation_folder:
                continue
            navigation_folder_path = "/".join(navigation_folder.getPhysicalPath())
            results.append(
                {'index': i,
                'title': formatted_tab_title,
                'url': navigation_folder.absolute_url(),
                'selected': context_path.startswith(navigation_folder_path)}
            )
        return results

    def get_navigation_folder(self, tab_settings):
        folder_uid = getattr(tab_settings, "navigation_folder", "")
        return api.content.get(UID=folder_uid)

    def get_additional_columns(self, tab_settings):
        columns_uids = getattr(tab_settings, "additional_columns", [])
        results = []
        for uid in columns_uids:
            item = api.content.get(UID=uid)
            if item:
                results.append(item)
        return results


class SubMenuDetailView(MenuSupportView):
    """
    """
    def get_menu_subitems(self):
        return {'dynamic_items': self.get_dynamic_items(),
                'static_items': self.get_static_items}

    @property
    @view.memoize
    def selected_tab(self):
        if 'tab_id' not in self.request.form:
            return None
        try:
            selected_id = int(self.request.form.get('tab_id'))
        except ValueError:
            logger.error(
                "Invalid index number (%s). Unable to retrieve configuration." % self.request.form.get('tab_id')
            )
            return None
        settings = self.menu_settings
        if not settings:
            return None
        try:
            return settings[selected_id]
        except IndexError:
            logger.error(
                "Index(%s) not found in menu settings. Unable to retrieve configuration." % selected_id
            )
            return None
        return None

    def get_dynamic_items(self):
        settings = self.selected_tab
        if not settings:
            return []
        navigation_folder = self.get_navigation_folder(settings)
        if not navigation_folder:
            return []
        results = []
        context = self.context.aq_inner
        context_path = "/".join(context.getPhysicalPath())
        if IFolderish.providedBy(navigation_folder):
            for item in navigation_folder.listFolderContents():
                item_path = "/".join(item.getPhysicalPath())
                result_dict = {
                    'title': item.Title(),
                    'description': item.Description() or item.Title(),
                    'url': item.absolute_url(),
                    'selected': context_path.startswith(item_path)
                }
                results.append(result_dict)
        return results

    def get_static_items(self):
        settings = self.selected_tab
        if not settings:
            return []
        additional_columns = self.get_additional_columns(settings)
        if not additional_columns:
            return []
        results = []
        for item in additional_columns:
            if item.getText():
                results.append(
                 {'id': item.getId(),
                  'text': item.getText()}
                )
        return results
