# -*- coding: utf-8 -*-
from collective.editablemenu import logger

def post_install(portal, context):
    """Post install script"""
    if context.readDataFile('collectiveeditablemenu_default.txt') is None:
        return

    setup_tool = portal.portal_setup
    setup_tool.runAllImportStepsFromProfile(
        'profile-collective.editablemenu:clean')
    logger.info("Clean old field from registry done")
    # Do something during the installation of this package
