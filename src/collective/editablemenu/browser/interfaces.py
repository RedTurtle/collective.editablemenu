# -*- coding: utf-8 -*-
from .widgets import EditableMenuSettingsFieldWidget
from collective.editablemenu import _
from plone.autoform import directives as form
from plone.supermodel import model
from zope import schema


class IEditableMenuSettings(model.Schema):
    """Settings used in the control panel for cookiecosent: unified panel
    """
    form.widget(menu_tabs_json=EditableMenuSettingsFieldWidget)
    menu_tabs_json = schema.Text(
        title=_('config_tabs_label', u'Menu configuration.'),
        required=False,
        default=u'{"/":[]}',
    )
