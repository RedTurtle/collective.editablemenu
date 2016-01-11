# -*- coding: utf-8 -*-
from collective.editablemenu import _
from collective.editablemenu.browser.interfaces import IEditableMenuSettings
from plone.app.registry.browser import controlpanel


class EditableMenuSettingsEditForm(controlpanel.RegistryEditForm):
    """Media settings form.
    """
    schema = IEditableMenuSettings
    id = "EditableMenuSettingsForm"
    label = _(u"Editable Menu Settings")


class EditableMenuSettingsView(controlpanel.ControlPanelFormWrapper):
    """Sitesearch settings control panel.
    """
    form = EditableMenuSettingsEditForm
