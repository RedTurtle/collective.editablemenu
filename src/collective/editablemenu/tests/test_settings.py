# -*- coding: utf-8 -*-
"""Setup tests for this package."""
from collective.editablemenu.browser.interfaces import IEditableMenuSettings
from collective.editablemenu.testing import (
    COLLECTIVE_EDITABLEMENU_INTEGRATION_TESTING,
)  # noqa
from plone import api
from plone.app.testing import TEST_USER_ID
from plone.app.testing import TEST_USER_NAME
from plone.app.testing import login
from plone.app.testing import setRoles

import json
import six
import unittest


class TestGlobalSettings(unittest.TestCase):
    """Test that helper view returns correct data."""

    layer = COLLECTIVE_EDITABLEMENU_INTEGRATION_TESTING

    def setUp(self):
        """Custom shared utility setup for tests."""
        self.portal = self.layer['portal']
        self.request = self.layer['request']
        setRoles(self.portal, TEST_USER_ID, ['Manager'])
        login(self.portal, TEST_USER_NAME)
        self.settings = {
            '/': [
                {
                    'navigation_folder': '',
                    'simple_link': '',
                    'tab_title': 'Foo',
                    'additional_columns': '',
                    'condition': 'python: True',
                },
                {
                    'navigation_folder': '',
                    'simple_link': '',
                    'tab_title': 'Bar',
                    'additional_columns': '',
                    'condition': 'python: True',
                },
            ]
        }
        value = json.dumps(self.settings)
        if six.PY2:
            value = value.decode('utf8')
        api.portal.set_registry_record(
            'menu_tabs_json', value, interface=IEditableMenuSettings
        )
        api.content.create(
            container=self.portal, type='Folder', id='folder', title='Folder'
        )
        self.document1 = api.content.create(
            container=self.portal['folder'],
            type='Document',
            title='Document 1',
            id='document-1',
            text='Text for document 1',
        )
        self.document2 = api.content.create(
            container=self.portal['folder'],
            type='Document',
            title='Document 2',
            id='document-2',
            text='Text for document 2',
        )
        self.support_view = api.content.get_view(
            name='menu_support_view', context=self.portal, request=self.request
        )
        self.submenu_view = api.content.get_view(
            name='submenu_detail_view',
            context=self.portal,
            request=self.request,
        )

    def test_support_view_menu_tabs(self):
        """Test if collective.editablemenu is installed."""
        example_tabs = [
            {'index': 0, 'title': '<span>Foo</span>'},
            {'index': 1, 'title': '<span>Bar</span>'},
        ]
        tabs = self.support_view.get_menu_tabs()
        self.assertEqual(len(tabs), 2)
        self.assertEqual(tabs, example_tabs)

    def test_submenu_view(self):
        """ test if submenu view returns the right values """
        example_submenu = {
            'dynamic_items': [],
            'navigation_folder': None,
            'static_items': [],
        }
        self.assertEqual(self.submenu_view.get_menu_subitems(), {})
        self.assertEqual(self.submenu_view.get_menu_subitems('foo'), {})
        self.assertEqual(
            self.submenu_view.get_menu_subitems(0), example_submenu
        )

    def test_with_navigation_folder(self):
        """
        Set navigation folder for one menu tab, and check if menu
        is correctly populated
        """
        new_settings = self.settings.copy()
        new_settings['/'][0]['navigation_folder'] = '/folder'
        value = json.dumps(new_settings)
        if six.PY2:
            value = value.decode('utf8')
        api.portal.set_registry_record(
            'menu_tabs_json', value, interface=IEditableMenuSettings
        )
        tabs = self.support_view.get_menu_tabs()
        self.assertEqual(tabs[0].get('url', ''), 'http://nohost/plone/folder')
        self.assertFalse(tabs[0].get('selected', ''))
        self.assertEqual(tabs[1].get('url', ''), '')

        submenu_0 = self.submenu_view.get_menu_subitems(0)
        submenu_1 = self.submenu_view.get_menu_subitems(1)
        self.assertEqual(len(submenu_0.get('dynamic_items')), 2)
        self.assertEqual(len(submenu_0.get('static_items')), 0)
        self.assertEqual(
            submenu_0.get('navigation_folder'), self.portal['folder']
        )
        self.assertEqual(len(submenu_1.get('dynamic_items')), 0)
        self.assertEqual(len(submenu_1.get('static_items')), 0)
        self.assertEqual(submenu_1.get('navigation_folder'), None)

    def test_with_static_items(self):
        """
        Set navigation folder for one menu tab, and check if menu
        is correctly populated
        """
        new_settings = self.settings.copy()
        new_settings['/'][0]['additional_columns'] = '/folder'
        value = json.dumps(new_settings)
        if six.PY2:
            value = value.decode('utf8')
        api.portal.set_registry_record(
            'menu_tabs_json', value, interface=IEditableMenuSettings
        )
        tabs = self.support_view.get_menu_tabs()
        self.assertEqual(tabs[0].get('url', ''), '')
        self.assertFalse(tabs[0].get('selected', ''))
        self.assertEqual(tabs[1].get('url', ''), '')

        submenu_0 = self.submenu_view.get_menu_subitems(0)
        submenu_1 = self.submenu_view.get_menu_subitems(1)
        self.assertEqual(len(submenu_0.get('dynamic_items')), 0)
        self.assertEqual(len(submenu_0.get('static_items')), 2)
        self.assertEqual(submenu_0.get('navigation_folder'), None)
        static_items = submenu_0.get('static_items')
        self.assertEqual(static_items[0]['id'], self.document1.getId())
        self.assertEqual(static_items[1]['id'], self.document2.getId())
        self.assertEqual(static_items[0]['text'], self.document1.text)
        self.assertEqual(static_items[1]['text'], self.document2.text)
        self.assertEqual(len(submenu_1.get('dynamic_items')), 0)
        self.assertEqual(len(submenu_1.get('static_items')), 0)
        self.assertEqual(submenu_1.get('navigation_folder'), None)

    def test_dont_broke_if_root_path_is_not_set(self):
        settings = {
            '/foo': [
                {
                    'navigation_folder': '',
                    'simple_link': '',
                    'tab_title': 'Foo',
                    'additional_columns': '',
                    'condition': 'python: True',
                },
                {
                    'navigation_folder': '',
                    'simple_link': '',
                    'tab_title': 'Bar',
                    'additional_columns': '',
                    'condition': 'python: True',
                },
            ],
            '/xyz': [
                {
                    'navigation_folder': '',
                    'simple_link': '',
                    'tab_title': 'XYZ',
                    'additional_columns': '',
                    'condition': 'python: True',
                }
            ],
        }
        value = json.dumps(settings)
        if six.PY2:
            value = value.decode('utf8')
        api.portal.set_registry_record(
            'menu_tabs_json', value, interface=IEditableMenuSettings
        )

        self.assertEqual(self.support_view.get_menu_tabs(), [])
        # re-set settings as default for these tests
        value = json.dumps(self.settings)
        if six.PY2:
            value = value.decode('utf8')
        api.portal.set_registry_record(
            'menu_tabs_json', value, interface=IEditableMenuSettings
        )
