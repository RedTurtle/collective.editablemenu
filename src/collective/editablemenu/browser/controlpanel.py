# -*- coding: utf-8 -*-
from collective.editablemenu import _
from collective.editablemenu.browser.interfaces import IEditableMenuSettings
from plone.app.registry.browser import controlpanel
from Products.CMFPlone.resources import add_bundle_on_request


class EditableMenuSettingsEditForm(controlpanel.RegistryEditForm):
    """Editablemenu settings form.
    """
    schema = IEditableMenuSettings
    id = 'EditableMenuSettingsForm'
    label = _(u'Editable Menu Settings')


class EditableMenuSettingsView(controlpanel.ControlPanelFormWrapper):
    """Editablemenu settings control panel.
    """
    form = EditableMenuSettingsEditForm

    def __call__(self):
        add_bundle_on_request(self.request, 'editablemenu-widget-bundle')
        return super(EditableMenuSettingsView, self).__call__()
