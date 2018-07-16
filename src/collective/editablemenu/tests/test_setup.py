# -*- coding: utf-8 -*-
"""Setup tests for this package."""
from collective.editablemenu.interfaces import ICollectiveEditablemenuLayer
from collective.editablemenu.testing import COLLECTIVE_EDITABLEMENU_INTEGRATION_TESTING  # noqa
from plone import api
from plone.browserlayer import utils

import unittest


class TestSetup(unittest.TestCase):
    """Test that collective.editablemenu is properly installed."""

    layer = COLLECTIVE_EDITABLEMENU_INTEGRATION_TESTING

    def setUp(self):
        """Custom shared utility setup for tests."""
        self.portal = self.layer['portal']
        self.installer = api.portal.get_tool('portal_quickinstaller')

    def test_product_installed(self):
        """Test if collective.editablemenu is installed."""
        self.assertTrue(
            self.installer.isProductInstalled('collective.editablemenu'))

    def test_browserlayer(self):
        """Test that ICollectiveEditablemenuLayer is registered."""
        self.assertIn(ICollectiveEditablemenuLayer, utils.registered_layers())


class TestUninstall(unittest.TestCase):

    layer = COLLECTIVE_EDITABLEMENU_INTEGRATION_TESTING

    def setUp(self):
        self.portal = self.layer['portal']
        self.installer = api.portal.get_tool('portal_quickinstaller')
        self.installer.uninstallProducts(['collective.editablemenu'])

    def test_product_uninstalled(self):
        """Test if collective.editablemenu is cleanly uninstalled."""
        self.assertFalse(
            self.installer.isProductInstalled('collective.editablemenu'))
