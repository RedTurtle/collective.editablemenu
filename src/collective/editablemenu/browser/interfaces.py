# -*- coding: utf-8 -*-

from collective.editablemenu import _
from zope import schema
from zope.interface import Interface
from zope.interface import implementer
from plone.registry.field import PersistentField
from z3c.form.object import registerFactoryAdapter


class IMenuEntryPersistentObject(Interface):
    pass


@implementer(IMenuEntryPersistentObject)
class MenuEntryPersistentObject(PersistentField, schema.Object):
    pass


class IMenuEntrySubitem(Interface):
    """Single entry for the editable menu configuration
    """

    tab_title = schema.Text(
        title=_("tab_title_label", u"Tab title"),
        description=_('tab_title_help',
                      default=u"Insert the title of this tab."),
        default=u"",
        missing_value=u"",
        required=True,
    )

    navigation_folder = schema.TextLine(
        title=_("navigation_folder_label", u"Navigation folder"),
        description=_(
            'navigation_folder_help',
            u'Insert a path of the folder that should list'
            ' its contents in the menu.'),
        required=False,
        default=u"",
    )
    additional_columns = schema.TextLine(
        title=_('additional_columns_label', u'Additional columns'),
        description=_(
            'additional_columns_help',
            default=u"Insert a path of the folder that contains pages for"
                    " additional static columns."),
        required=False,
        default=u"",
    )
    simple_link = schema.TextLine(
        title=_('simple_link_label', u'Simple Link'),
        description=_(
            'simple_link_help',
            default=u"Insert a path of an element; this will override previous"
                    " settings and you will see just a single link in menu"
                    " without submenu."),
        required=False,
        default=u"",
    )
    condition = schema.TextLine(
        title=_('condition_label', u'Condition'),
        description=_(
            'condition_help',
            default=u"Insert condition (you can use variables like object,"
                    "portal, request, here, member... See complete list here:"
                    " http://docs.plone.org/develop/plone/functionality/expres"
                    "sions.html#expression-variables)"),
        required=False,
        default=u"python: True",
    )


@implementer(IMenuEntrySubitem)
class MenuEntrySubitem(object):
    """ """

registerFactoryAdapter(IMenuEntrySubitem, MenuEntrySubitem)


class IEditableMenuSettings(Interface):
    """Settings used in the control panel for cookiecosent: unified panel
    """
    menu_tabs = schema.Tuple(
        title=_('menu_tabs_label', u'Menu tab entry'),
        description=_(
            'menu_tabs_help',
            default=u"For every menu tab, provide some additional infos"),
        value_type=MenuEntryPersistentObject(
            IMenuEntrySubitem,
            title=_(u"Tab infos")),
        required=True,
        default=(),
        missing_value=(),
    )
