# -*- coding: utf-8 -*-
from Products.CMFCore.utils import getToolByName
from collective.editablemenu import logger
from plone import api
from collective.editablemenu.browser.interfaces import MenuEntrySubitem

default_profile = 'profile-collective.editablemenu:default'
REGISTRY_NAME = "collective.editablemenu.browser.interfaces.IEditableMenuSettings.menu_tabs"


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
        new_entry.condition = u'python: True'
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
            new_entry.navigation_folder = "/".join(navigation_folder.getPhysicalPath()).decode('utf-8')
        # we don't migrate additional columns because we can't know what's the common folder.
        new_settings.append(new_entry)
    return tuple(new_settings)
