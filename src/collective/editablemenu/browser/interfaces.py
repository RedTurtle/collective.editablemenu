# -*- coding: utf-8 -*-

from collective.editablemenu import _
from zope import schema
from zope.interface import Interface
from zope.interface import implementer
from plone.registry.field import PersistentField
from z3c.form.object import registerFactoryAdapter
from plone.formwidget.contenttree import UUIDSourceBinder
from plone.supermodel import model
from plone.directives import form
from plone.formwidget.contenttree import ContentTreeFieldWidget
from plone.formwidget.contenttree.widget import ContentTreeWidget
from plone.app.textfield.value import RichTextValue


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

    navigation_folder = schema.Choice(
        title=_("navigation_folder_label", u"Navigation folder"),
        description=_(
            'navigation_folder_help',
            u'Select the folder that should list its contents in the menu.'),
        source=UUIDSourceBinder(is_folderish=True),
        required=False
    )
    additional_columns = schema.List(
        title=_('additional_columns_label', u'Additional columns'),
        description=_(
            'additional_columns_help',
            default=u"For every menu tab, select some documents that contains text for additional static columns"),
        value_type=schema.Choice(
            title=_(u"Additional column"),
            source=UUIDSourceBinder(portal_type='Document')
        ),
        required=False
    )


@implementer(IMenuEntrySubitem)
class MenuEntrySubitem(object):
    """ """

registerFactoryAdapter(IMenuEntrySubitem, MenuEntrySubitem)


class IControlpanelSchema(IMenuEntrySubitem):
    selected_entry = schema.Int(
        title=_("selected_entry_label", u"Selected entry"),
        required=False,
    )


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
