# -*- coding: utf-8 -*-
from Products.CMFPlone.interfaces import INonInstallable
from zope.interface import implementer


@implementer(INonInstallable)
class HiddenProfiles(object):

    def getNonInstallableProfiles(self):
        """Hide uninstall profile from site-creation and quickinstaller."""
        return [
            'collective.editablemenu:uninstall',
            'collective.editablemenu:from_1300_to_1400',
            'collective.editablemenu:from_1400_to_1410',
            'collective.editablemenu:to_2000',
        ]


def post_install(context):
    """Post install script"""
    # Do something during the installation of this package


def uninstall(context):
    """Uninstall script"""
    # Do something at the end of the uninstallation of this package.
