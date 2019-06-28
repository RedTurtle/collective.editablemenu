# -*- coding: utf-8 -*-
from plone import api
from plone.memoize import view
from z3c.form import widget
from z3c.form.browser.textarea import TextAreaWidget
from z3c.form.interfaces import IFieldWidget
from z3c.form.interfaces import IFormLayer
from z3c.form.interfaces import ITextAreaWidget
from zope.component import adapter
from zope.interface import implementer
from zope.interface import implementer_only
from zope.schema.interfaces import IField

import json
import six


class IEditableMenuSettingsWidget(ITextAreaWidget):
    """Marker Interface"""


@implementer_only(IEditableMenuSettingsWidget)
class EditableMenuSettingsWidget(TextAreaWidget):
    target_field = 'textarea'

    @property
    def json_settings(self):
        support_view = api.content.get_view(
            name='menu_support_view',
            context=self.context,
            request=self.request,
        )
        return support_view.menu_settings

    @property
    def settings_titles(self):
        if not self.json_settings:
            return ''
        support_view = api.content.get_view(
            name='menu_support_view',
            context=self.context,
            request=self.request,
        )
        settings = json.loads(self.json_settings)
        return json.dumps(
            {key: support_view.find_path_title(key) for key in settings.keys()}
        )

    @property
    def menu_settings(self):
        support_view = api.content.get_view(
            name='menu_support_view',
            context=self.context,
            request=self.request,
        )
        if not self.json_settings:
            return []
        settings = json.loads(self.json_settings)
        return [
            (key, support_view.find_path_title(key), value)
            for key, value in six.iteritems(settings)
        ]

    @view.memoize
    def get_portal_url(self):
        return api.portal.get().absolute_url()


@adapter(IField, IFormLayer)
@implementer(IFieldWidget)
def EditableMenuSettingsFieldWidget(field, request):
    """Factory for EditableMenuSettingsWidget."""
    return widget.FieldWidget(field, EditableMenuSettingsWidget(request))
