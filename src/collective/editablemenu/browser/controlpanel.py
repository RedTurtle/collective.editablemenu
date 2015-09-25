# -*- coding: utf-8 -*-
from collective.editablemenu import _
from collective.editablemenu import logger
from collective.editablemenu.browser.interfaces import IControlpanelSchema
from collective.editablemenu.browser.interfaces import MenuEntrySubitem
from plone import api
from plone.formwidget.contenttree import ContentTreeFieldWidget
from plone.formwidget.contenttree import MultiContentTreeFieldWidget
from plone.memoize import view
from plone.z3cform.layout import wrap_form
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from z3c.form import button, form, field
from zope.component import getMultiAdapter
from zope.component import getMultiAdapter
from zope.interface import Interface
from zope.schema import Date, Choice
from plone.app.textfield.value import RichTextValue
from zope import schema
import z3c.form.field
from z3c.form.interfaces import HIDDEN_MODE

class EditableMenuEditForm(form.Form):

    fields = field.Fields(IControlpanelSchema)
    fields['navigation_folder'].widgetFactory = ContentTreeFieldWidget
    fields['additional_columns'].widgetFactory = MultiContentTreeFieldWidget
    menu_tabs = "collective.editablemenu.browser.interfaces.IEditableMenuSettings.menu_tabs"
    ignoreContext = True
    control_panel_view = "@@editable-menu-settings"

    def render(self):
        if self.request.form.get('delete_entry'):
            result = self.delete_registry_entry()
            if result:
                api.portal.show_message(
                    message='Entry deleted',
                    request=self.request)
            self.request.response.redirect("%s/%s" % (self.context.absolute_url(),
                                                  self.control_panel_view))
        return super(EditableMenuEditForm, self).render()

    @button.buttonAndHandler(_(u'Save'))
    def handleSave(self, action):
        data, errors = self.extractData()
        if errors:
            return False
        result_status = self.set_registry_entry(data)
        if result_status:
            api.portal.show_message(message='Changes saved', request=self.request)
        else:
            return False
        self.request.response.redirect("%s/%s" % (self.context.absolute_url(),
                                                  self.control_panel_view))

    @button.buttonAndHandler(_(u'Cancel'))
    def handleCancel(self, action):
        self.request.response.redirect("%s/%s" % (self.context.absolute_url(),
                                                  self.control_panel_view))

    def updateWidgets(self):
        if self.request.get('selected_entry'):
            self.update_field_values()
        super(EditableMenuEditForm, self).updateWidgets()
        self.widgets['tab_title'].rows=5
        self.widgets['selected_entry'].mode = HIDDEN_MODE

    def set_registry_entry(self, data):
        settings = list(api.portal.get_registry_record(self.menu_tabs))
        if data.get('selected_entry') is not None:
            return self.update_entry(settings, data)
        else:
            # is a new entry
            new_value = self.create_new_entry(data)
            settings.append(new_value)
            api.portal.set_registry_record(self.menu_tabs, tuple(settings))
            return True

    def delete_registry_entry(self):
        settings = list(api.portal.get_registry_record(self.menu_tabs))
        if not settings:
            api.portal.show_message(
                message=_(
                    'no_settings_label',
                    'Unable to delete entry. Empty settings'),
                request=self.request,
                type="warning")
            return False
        try:
            selected_entry = int(self.request.form.get('delete_entry'))
        except ValueError:
            logger.error(
                "[update_field_values] Invalid index number: %s" % self.request.form.get('selected_entry')
            )
            api.portal.show_message(
                message=_(
                    'no_settings_label',
                    'Unable to delete entry. Invalid entry number.'),
                request=self.request,
                type="error")
            return False
        del settings[selected_entry]
        api.portal.set_registry_record(self.menu_tabs, tuple(settings))
        return True

    def update_entry(self, settings, data):
        try:
            settings_entry = settings[data['selected_entry']]
        except ValueError:
            logger.error(
                "[set_registry_entry] Invalid index number: %s" % data['selected_entry']
            )
            api.portal.show_message(
                message='Unable to edit data. Entry not found.',
                request=self.request,
                type="error")
            return False
        settings_entry.tab_title = data.get('tab_title', None)
        navigation_folder = api.content.get(
            UID=data.get('navigation_folder')
            )
        if navigation_folder:
            settings_entry.navigation_folder = api.content.get_uuid(obj=navigation_folder)
        else:
            settings_entry.navigation_folder = ""
        additional_columns = []
        for additional_column_uid in data.get('additional_columns'):
            additional_content =  api.content.get(
                UID=additional_column_uid)
            if additional_content:
                additional_columns.append(api.content.get_uuid(obj=additional_content))
        settings_entry.additional_columns = additional_columns
        return True

    def create_new_entry(self, data):
        """
        """
        new_entry = MenuEntrySubitem()
        if data.get('tab_title'):
            new_entry.tab_title = data.get('tab_title')
        new_entry.navigation_folder = data.get('navigation_folder')
        new_entry.additional_columns = data.get('additional_columns')
        return new_entry

    def get_stored_settings(self):
        entries = api.portal.get_registry_record(self.menu_tabs)
        results = []
        for entry in entries:
            res_dict = {'additional_columns': [],
                        'tab_title': '',
                        'navigation_folder': None}
            if getattr(entry, 'tab_title', None):
                # this text is used inside a link, so i can't use portal_transorms
                # because it wraps all inside a <p> tag.
                # I wrap every row inside a span, so they can be easily styled
                rows = ["<span>%s</span>" % x for x in entry.tab_title.split("\r\n")]
                res_dict['tab_title'] = "<br/>".join(rows)
            navigation_folder_uid = getattr(entry, 'navigation_folder', '')
            if navigation_folder_uid:
                navigation_folder = api.content.get(UID=navigation_folder_uid)
                if navigation_folder:
                    res_dict['navigation_folder'] = navigation_folder
            for additional_column_uid in getattr(entry, 'additional_columns', ()):
                additional_content = api.content.get(
                    UID=additional_column_uid)
                if additional_content:
                    res_dict['additional_columns'].append(additional_content)
            results.append(res_dict)
        return results

    def update_field_values(self):
        settings = api.portal.get_registry_record(self.menu_tabs)
        if not settings:
            return
        try:
            selected_entry = int(self.request.form.get('selected_entry'))
        except ValueError:
            logger.error(
                "[update_field_values] Invalid index number: %s" % self.request.form.get('selected_entry')
            )
            return
        try:
            selected_settings = settings[selected_entry]
            # i set the values in the request and not directly in the widget
            # value, so the contenttree widget setup correctly
            if getattr(selected_settings, 'tab_title', None):
                self.request.form['form.widgets.tab_title'] = selected_settings.tab_title
            self.request.form['form.widgets.selected_entry'] = selected_entry
            if getattr(selected_settings, 'navigation_folder', ''):
                navigation_folder =  api.content.get(
                    UID=getattr(selected_settings, 'navigation_folder', '')
                )
                if navigation_folder:
                    self.request.form['form.widgets.navigation_folder'] = "/".join(navigation_folder.getPhysicalPath())
            for additional_column_uid in getattr(selected_settings, 'additional_columns', ()):
                additional_content =  api.content.get(
                    UID=additional_column_uid)
                if not additional_content:
                    continue
                if "form.widgets.additional_columns" not in self.request.form:
                    self.request.form['form.widgets.additional_columns'] = ["/".join(additional_content.getPhysicalPath())]
                else:
                    self.request.form['form.widgets.additional_columns'].append("/".join(additional_content.getPhysicalPath()))
            # self.request.form['form.widgets.additional_columns'] = getattr(selected_settings, 'additional_columns', [])
        except IndexError:
            logger.error(
                "[update_field_values] Entry (%s) not found in %s" % (
                    selected_entry, self.menu_tabs)
            )
            return

EditableMenuSettingsView = wrap_form(
    EditableMenuEditForm,
    index=ViewPageTemplateFile('templates/controlpanel.pt'))
