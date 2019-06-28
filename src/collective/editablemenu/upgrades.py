# -*- coding: utf-8 -*-
from collective.editablemenu import logger
from plone import api

import json
import six


default_profile = 'profile-collective.editablemenu:default'
OLD_REGISTRY_NAME = 'collective.editablemenu.browser.interfaces.' + \
    'IEditableMenuSettings.menu_tabs'

REGISTRY_NAME = 'collective.editablemenu.browser.interfaces.' + \
    'IEditableMenuSettings.menu_tabs_json'


def from_1300_to_1400(context):
    logger.info('Upgrading collective.editablemenu to version 1400')
    setup_tool = api.portal.get_tool(name='portal_setup')
    new_settings = generate_new_settings_for_1400()
    setup_tool.runImportStepFromProfile(default_profile, 'plone.app.registry')
    api.portal.set_registry_record(REGISTRY_NAME, new_settings)

    setup_tool.runAllImportStepsFromProfile(
        'profile-collective.editablemenu:from_1300_to_1400')
    logger.info('Clean old field from registry done')


def from_1400_to_1410(context):
    logger.info('Upgrading collective.editablemenu to version 1410')
    setup_tool = api.portal.get_tool(name='portal_setup')
    setup_tool.runAllImportStepsFromProfile(
        'profile-collective.editablemenu:from_1400_to_1410')
    logger.info('Removed non minified js file')


def to_2000(context):
    logger.info('Upgrading collective.editablemenu to version 2000')
    setup_tool = api.portal.get_tool('portal_setup')
    setup_tool.runImportStepFromProfile(default_profile, 'plone.app.registry')
    setup_tool.runAllImportStepsFromProfile(
        'profile-collective.editablemenu:to_2000')
    logger.info('Moved to resource registry')


def generate_new_settings_for_1400():
    """
    """
    menu_config = {}
    menu_items = api.portal.get_registry_record(OLD_REGISTRY_NAME)
    tabs_item = []
    for item in menu_items:
        tabs_item.append(item.__dict__)
    menu_config.update({'/': tabs_item})
    return six.text_type(json.dumps(menu_config))
