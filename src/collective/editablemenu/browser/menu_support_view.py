# -*- coding: utf-8 -*-
from Products.Five import BrowserView
from plone import api
from collective.editablemenu import logger
from plone.memoize import view
from Products.CMFCore.interfaces import IFolderish
from Products.CMFCore.Expression import Expression, getExprContext
from AccessControl import Unauthorized


class MenuSupportView(BrowserView):
    """
    """
    registry = "collective.editablemenu.browser.interfaces.IEditableMenuSettings.menu_tabs"

    @property
    @view.memoize
    def menu_settings(self):
        return api.portal.get_registry_record(self.registry)

    def exclude_from_nav(self, item):
        try:
            # Archetypes
            return item.exclude_from_nav()
        except (TypeError, AttributeError):
            # DX Item
            return getattr(item, 'exclude_from_nav', False)

    def get_menu_tabs(self):
        context = self.context.aq_inner
        context_path = "/".join(context.getPhysicalPath())
        settings = self.menu_settings
        if not settings:
            return []
        results = []

        for i, tab_settings in enumerate(settings):
            # evaluate condition
            condition = tab_settings.condition or ''
            expression = Expression(condition)
            expression_context = getExprContext(self.context, self.context)
            value = expression(expression_context)

            if isinstance(value, basestring) and value.strip() == "":
                value = True

            if not value:
                continue

            tab_title = getattr(tab_settings, "tab_title", '')
            if not tab_title:
                continue

            tab_dict = {'index': i}
            # this text is used inside a link, so i can't use portal_transorms
            # because it wraps all inside a <p> tag.
            # I wrap every row inside a span, so they can be easily styled
            rows = ["<span>%s</span>" % x for x in tab_title.split("\r\n")]
            # tab_dict['title'] = "<br/>".join(rows)
            tab_dict['title'] = "".join(rows)

            navigation_folder = self.get_navigation_folder(tab_settings)
            #need to do something better
            if navigation_folder == '__skip_this_folder__':
                continue

            if navigation_folder:
                tab_dict['url'] = navigation_folder.absolute_url()
                tab_dict['selected'] = context_path.startswith(
                    "/".join(navigation_folder.getPhysicalPath()))
            if tab_settings.simple_link:
                tab_dict['url'] = tab_settings.simple_link
                tab_dict['clickandgo'] = True
            results.append(tab_dict)
        return results

    @view.memoize
    def get_navigation_folder(self, tab_settings):
        folder_path = getattr(tab_settings, "navigation_folder", "")
        if not folder_path:
            return None
        if not folder_path.startswith("/"):
            folder_path = "/" + folder_path
        try:
            obj = api.content.get(path=folder_path.encode('utf-8'))
        except Unauthorized:
            return '__skip_this_folder__'
        # don't want to check for other exception! need to know if this menu
        # breaks
        return obj

    @view.memoize
    def get_additional_columns(self, tab_settings):
        """
        return additional columns set in the settings,
        except the items excluded from nav
        """
        folder_path = getattr(tab_settings, "additional_columns", [])
        if not folder_path:
            return []
        if not folder_path.startswith("/"):
            folder_path = "/" + folder_path
        folder = api.content.get(path=folder_path.encode('utf-8'))
        if not folder:
            return []
        # return [x for x in folder.listFolderContents() if not self.exclude_from_nav(x)]
        return filter(
            lambda x: not self.exclude_from_nav(x),
            folder.listFolderContents()
        )


class SubMenuDetailView(MenuSupportView):
    """
    """
    def get_menu_subitems(self, tab_id=None):
        if tab_id is None:
            tab_id = self.request.form.get('tab_id')
        if tab_id is None:
            return {}
        settings = self.get_selected_tab(tab_id)
        if not settings:
            return {}
        return {'navigation_folder': self.get_navigation_folder(settings),
                'dynamic_items': self.get_dynamic_items(settings),
                'static_items': self.get_static_items(settings)}

    def get_selected_tab(self, tab_id):
        if isinstance(tab_id, str):
            try:
                tab_id = int(tab_id)
            except ValueError:
                logger.error(
                    "Invalid index number (%s). Unable to retrieve configuration." % tab_id
                )
                return None
        settings = self.menu_settings
        if not settings:
            return None
        try:
            return settings[tab_id]
        except IndexError:
            logger.error(
                "Index(%s) not found in menu settings. Unable to retrieve configuration." % tab_id
            )
            return None
        return None

    def get_dynamic_items(self, settings):
        navigation_folder = self.get_navigation_folder(settings)
        if not navigation_folder:
            return []
        results = []
        context = self.context.aq_inner
        context_path = "/".join(context.getPhysicalPath())
        if IFolderish.providedBy(navigation_folder):
            for item in navigation_folder.listFolderContents():
                if not self.exclude_from_nav(item):
                    item_path = "/".join(item.getPhysicalPath())
                    result_dict = {
                        'title': item.Title(),
                        'description': item.Description() or item.Title(),
                        'url': item.absolute_url(),
                        'selected': context_path.startswith(item_path)
                    }
                    results.append(result_dict)
        return results

    def get_static_items(self, settings):
        additional_columns = self.get_additional_columns(settings)
        if not additional_columns:
            return []
        results = []
        for item in additional_columns:
            text = ""
            try:
                # AT
                text = item.getText()
            except AttributeError:
                # DX
                text = getattr(item, 'text', None)
                if text:
                    text = text.output
            if text:
                results.append({
                    'id': item.getId(),
                    'text': text
                })
        return results
