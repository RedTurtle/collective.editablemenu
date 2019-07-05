# -*- coding: utf-8 -*-
from AccessControl import Unauthorized
from collective.editablemenu import logger
from collective.editablemenu.browser.interfaces import IEditableMenuSettings
from plone import api
from plone.api.exc import InvalidParameterError
from plone.memoize import view
from Products.CMFCore.Expression import Expression
from Products.CMFCore.Expression import getExprContext
from Products.CMFCore.interfaces import IFolderish
from Products.Five import BrowserView

import json
import six


class MenuSupportView(BrowserView):
    """
    """

    @property
    @view.memoize
    def menu_settings(self):
        try:
            return api.portal.get_registry_record(
                'menu_tabs_json', interface=IEditableMenuSettings
            )
        except (InvalidParameterError, KeyError):
            return ''

    @property
    @view.memoize
    def get_root_site(self):
        return ''.join(api.portal.get().getPhysicalPath())

    @view.memoize
    def find_path_title(self, path):
        if not path:
            return ''
        if path == '/':
            return api.portal.get().Title()
        search_path = '/{0}{1}'.format(api.portal.get().getId(), path)
        results = api.content.find(depth=0, path=search_path)
        if len(results) > 0:
            return results[0].Title
        else:
            return ''

    def exclude_from_nav(self, item):
        try:
            # Archetypes
            return item.exclude_from_nav()
        except (TypeError, AttributeError):
            # DX Item
            return getattr(item, 'exclude_from_nav', False)

    def choose_site_menu_config(self, settings):
        path = '/'.join(self.context.getPhysicalPath())
        root_path = self.get_root_site
        if self.context.id == root_path:
            path = '/'
        else:
            path = path.split(root_path)[1]

        if not path:
            return '/'
        sites_path = list(settings.keys())
        not_found = True
        while not_found:
            for site_path in sites_path:
                if path == site_path:
                    return site_path
            path = '/'.join(path.split('/')[:-1])
            if not path:
                return '/'

    def get_menu_tabs(self):
        context = self.context.aq_inner
        context_path = '/'.join(context.getPhysicalPath())
        if not self.menu_settings:
            return []
        settings = json.loads(self.menu_settings)
        if not settings:
            return []
        results = []

        candidate_site = self.choose_site_menu_config(settings)
        for i, tab_settings in enumerate(settings.get(candidate_site, [])):
            # evaluate condition
            condition = tab_settings.get('condition', '')
            expression = Expression(condition)
            expression_context = getExprContext(self.context, self.context)
            value = expression(expression_context)

            if isinstance(value, six.string_types) and value.strip() == '':
                value = True

            if not value:
                continue
            tab_title = tab_settings.get('tab_title', '')
            if six.PY2 and isinstance(tab_title, six.text_type):
                tab_title = tab_title.encode('utf8')
            if not tab_title:
                continue

            tab_dict = {'index': i}
            # this text is used inside a link, so i can't use portal_transorms
            # because it wraps all inside a <p> tag.
            # I wrap every row inside a span, so they can be easily styled
            rows = tab_title.replace('\r', '').split('\n')
            rows = ['<span>{0}</span>'.format(x) for x in rows]
            tab_dict['title'] = ''.join(rows)

            navigation_folder = self.get_navigation_folder(tab_settings)
            # need to do something better
            if navigation_folder == '__skip_this_folder__':
                continue

            if navigation_folder:
                tab_dict['url'] = navigation_folder.absolute_url()
                tab_dict['selected'] = context_path.startswith(
                    '/'.join(navigation_folder.getPhysicalPath())
                )
            if tab_settings.get('simple_link', ''):
                tab_dict['url'] = self.fixLink(tab_settings.get('simple_link'))
                tab_dict['clickandgo'] = True
            results.append(tab_dict)
        return results

    def fixLink(self, link):
        if link.startswith('http'):
            return link
        return '{0}/{1}'.format(
            api.portal.get().absolute_url(), link.lstrip('/')
        )

    @view.memoize
    def get_object(self, folder_path):
        if six.PY2 and isinstance(folder_path, six.text_type):
            folder_path = folder_path.encode('utf8')
        return api.content.get(path=folder_path)

    def get_navigation_folder(self, tab_settings):
        folder_path = tab_settings.get('navigation_folder', '')
        if not folder_path:
            return None
        if not folder_path.startswith('/'):
            folder_path = '/' + folder_path
        try:
            obj = self.get_object(folder_path)
        except Unauthorized:
            return '__skip_this_folder__'
        # don't want to check for other exception! need to know if this menu
        # breaks
        return obj

    @view.memoize
    def get_folder(self, folder_path):
        if six.PY2 and isinstance(folder_path, six.text_type):
            folder_path = folder_path.encode('utf8')
        try:
            return api.content.get(path=folder_path)
        except Unauthorized:
            return None

    def get_additional_columns(self, tab_settings):
        """
        return additional columns set in the settings,
        except the items excluded from nav
        """
        folder_path = tab_settings.get('additional_columns', [])
        if not folder_path:
            return []
        if not folder_path.startswith('/'):
            folder_path = '/' + folder_path
        folder = self.get_folder(folder_path)
        if not folder:
            return []
        # return folder contents not excluded from navigation
        return [
            x
            for x in folder.listFolderContents()
            if not self.exclude_from_nav(x)
        ]


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
        return {
            'navigation_folder': self.get_navigation_folder(settings),
            'dynamic_items': self.get_dynamic_items(settings),
            'static_items': self.get_static_items(settings),
        }

    def get_selected_tab(self, tab_id):
        if isinstance(tab_id, str):
            try:
                tab_id = int(tab_id)
            except ValueError:
                msg = 'Invalid index number ({0}). Unable to retrieve configuration.'.format(  # noqa
                    tab_id
                )
                logger.error(msg)
                return None
        settings = json.loads(self.menu_settings)
        if not settings:
            return None
        try:
            candidate_site = self.choose_site_menu_config(settings)
            return settings[candidate_site][tab_id]
        except IndexError:
            logger.error(
                'Index({0}) not found in menu settings.'
                ' Unable to retrieve configuration.'.format(tab_id)
            )
            return None
        return None

    def get_dynamic_items(self, settings):
        navigation_folder = self.get_navigation_folder(settings)
        if not navigation_folder:
            return []
        results = []
        context = self.context.aq_inner
        context_path = '/'.join(context.getPhysicalPath())
        if IFolderish.providedBy(navigation_folder):
            for item in navigation_folder.listFolderContents():
                if not self.exclude_from_nav(item):
                    item_path = '/'.join(item.getPhysicalPath())
                    result_dict = {
                        'title': item.Title(),
                        'description': item.Description() or item.Title(),
                        'url': item.absolute_url(),
                        'selected': context_path.startswith(item_path),
                    }
                    results.append(result_dict)
        return results

    def get_static_items(self, settings):
        additional_columns = self.get_additional_columns(settings)
        if not additional_columns:
            return []
        results = []
        for item in additional_columns:
            text = ''
            try:
                # AT
                text = item.getText()
            except AttributeError:
                # DX
                text = getattr(item, 'text', None)
                if text:
                    text = getattr(text, 'output', text)
            if text:
                results.append({'id': item.getId(), 'text': text})
        return results
