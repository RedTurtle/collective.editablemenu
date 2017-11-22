# -*- coding: utf-8 -*-
from Products.CMFCore.utils import getToolByName
from collective.editablemenu import logger
from plone import api
from collective.editablemenu.browser.interfaces import MenuEntrySubitem
import json


default_profile = 'profile-collective.editablemenu:default'
REGISTRY_NAME = "collective.editablemenu.browser.interfaces." + \
    "IEditableMenuSettings.menu_tabs"

NEW_REGISTRY_NAME = "collective.editablemenu.browser.interfaces." + \
    "IEditableMenuSettings.menu_tabs_json"

# fields and defaults. 'cause we need to add properties we have in
# MenuEntrySubItems when we upgrade menu. we could have problem from oldest
# version when we need to upgrade to different new ones
FIELDS = {
    'tab_title': u'',
    'navigation_folder': u'',
    'additional_columns': u'',
    'simple_link': u'',
    'condition': u'python: True'
}


def filler(new_entry):
    for field in FIELDS:
        if not hasattr(new_entry, field):
            setattr(new_entry, field, FIELDS[field])
    return new_entry


def to_1100(context):
    """
    delete old registry configuration and add a new one
    """
    logger.info('Upgrading collective.editablemenu to version 1100')
    setup_tool = getToolByName(context, 'portal_setup')
    new_settings = generate_new_settings()
    setup_tool.runImportStepFromProfile(default_profile, 'plone.app.registry')
    api.portal.set_registry_record(REGISTRY_NAME, new_settings)


def from_1100_to_1200(context):
    """
    delete old registry configuration and add a new one
    """
    logger.info('Upgrading collective.editablemenu to version 1200')
    setup_tool = getToolByName(context, 'portal_setup')
    new_settings = generate_new_settings_for_1200()
    setup_tool.runImportStepFromProfile(default_profile, 'plone.app.registry')
    api.portal.set_registry_record(REGISTRY_NAME, new_settings)


def from_1200_to_1300(context):
    logger.info('Upgrading collective.editablemenu to version 1300')
    setup_tool = getToolByName(context, 'portal_setup')
    new_settings = generate_new_settings_for_1300()
    setup_tool.runImportStepFromProfile(default_profile, 'plone.app.registry')
    api.portal.set_registry_record(REGISTRY_NAME, new_settings)

def from_1300_to_1400(context):
    logger.info('Upgrading collective.editablemenu to version 1400')
    setup_tool = getToolByName(context, 'portal_setup')
    new_settings = generate_new_settings_for_1400()
    setup_tool.runImportStepFromProfile(default_profile, 'plone.app.registry')
    api.portal.set_registry_record(NEW_REGISTRY_NAME, new_settings)

    setup_tool.runAllImportStepsFromProfile(
        'profile-collective.editablemenu:from_1300_to_1400')
    logger.info("Clean old field from registry done")

def generate_new_settings_for_1400():
    """
    """
    portal = api.portal.get()
    menu_config = {}
    menu_items = api.portal.get_registry_record(REGISTRY_NAME)
    root_site_id = '/%s' % portal.id
    tabs_item = []
    for item in menu_items:
        tabs_item.append(menu_items[0].__dict__)
    menu_config.update({root_site_id: tabs_item})
    return unicode(json.dumps(menu_config))

def generate_new_settings_for_1200():
    """
    """
    old_settings = api.portal.get_registry_record(REGISTRY_NAME)
    if not old_settings:
        return
    new_settings = []
    for setting in old_settings:
        new_entry = MenuEntrySubitem()
        new_entry.tab_title = setting.tab_title
        new_entry.additional_columns = u""
        new_entry.navigation_folder = u""
        new_entry.simple_link = u""
        for key in setting.__dict__:
            setattr(new_entry, key, getattr(setting, key))
        new_entry = filler(new_entry)
        new_settings.append(new_entry)
    return tuple(new_settings)


def generate_new_settings_for_1300():
    """
    """
    old_settings = api.portal.get_registry_record(REGISTRY_NAME)
    if not old_settings:
        return
    new_settings = []
    for setting in old_settings:
        new_entry = MenuEntrySubitem()
        new_entry.tab_title = setting.tab_title
        new_entry.additional_columns = u""
        new_entry.navigation_folder = u""
        new_entry.simple_link = u""
        for key in setting.__dict__:
            setattr(new_entry, key, getattr(setting, key))
        new_entry = filler(new_entry)
        new_settings.append(new_entry)
    return tuple(new_settings)


def generate_new_settings():
    """
    """
    old_settings = api.portal.get_registry_record(REGISTRY_NAME)
    if not old_settings:
        return
    new_settings = []
    for setting in old_settings:
        new_entry = MenuEntrySubitem()
        new_entry.tab_title = setting.tab_title
        new_entry.additional_columns = u""
        new_entry.navigation_folder = u""
        navigation_folder = api.content.get(UID=setting.navigation_folder)
        if navigation_folder:
            new_entry.navigation_folder = "/".join(
                navigation_folder.getPhysicalPath()
            ).decode('utf-8')
        # we don't migrate additional columns because we can't
        # know what's the common folder.
        new_settings.append(new_entry)
    return tuple(new_settings)
