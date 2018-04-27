# -*- coding: utf-8 -*-
from .widgets import EditableMenuSettingsFieldWidget
from collective.editablemenu import _
from plone.autoform import directives as form
from plone.registry.field import PersistentField
from plone.supermodel import model
from z3c.form.object import registerFactoryAdapter
from zope import schema
from zope.interface import implementer
from zope.interface import Interface


class IMenuEntryPersistentObject(Interface):
    pass


@implementer(IMenuEntryPersistentObject)
class MenuEntryPersistentObject(PersistentField, schema.Object):
    pass


class IMenuEntrySubitem(Interface):
    """Single entry for the editable menu configuration
    """

    tab_title = schema.Text(
        title=_('tab_title_label', u'Tab title'),
        description=_('tab_title_help',
                      default=u'Insert the title of this tab.'),
        default=u'',
        missing_value=u'',
        required=True,
    )

    navigation_folder = schema.TextLine(
        title=_('navigation_folder_label', u'Navigation folder'),
        description=_(
            'navigation_folder_help',
            u'Insert a path of the folder that should list'
            ' its contents in the menu.'),
        required=False,
        default=u'',
    )
    additional_columns = schema.TextLine(
        title=_('additional_columns_label', u'Additional columns'),
        description=_(
            'additional_columns_help',
            default=u'Insert a path of the folder that contains pages for'
                    ' additional static columns.'),
        required=False,
        default=u'',
    )
    simple_link = schema.TextLine(
        title=_('simple_link_label', u'Simple Link'),
        description=_(
            'simple_link_help',
            default=u'Insert a path of an element; this will override previous'
                    ' settings and you will see just a single link in menu'
                    ' without submenu.'),
        required=False,
        default=u'',
    )
    condition = schema.TextLine(
        title=_('condition_label', u'Condition'),
        description=_(
            'condition_help',
            default=u'Insert condition (you can use variables like object,'
                    'portal, request, here, member... See complete list here:'
                    ' http://docs.plone.org/develop/plone/functionality/expres'
                    'sions.html#expression-variables)'),
        required=False,
        default=u'python: True',
    )


@implementer(IMenuEntrySubitem)
class MenuEntrySubitem(object):
    """ """


registerFactoryAdapter(IMenuEntrySubitem, MenuEntrySubitem)


class IEditableMenuSettings(model.Schema):
    """Settings used in the control panel for cookiecosent: unified panel
    """
    form.widget(menu_tabs_json=EditableMenuSettingsFieldWidget)
    menu_tabs_json = schema.Text(
        title=_('config_tabs_label', u'Menu configuration.'),
        required=False,
        default=u'{"/":[]}',
    )
