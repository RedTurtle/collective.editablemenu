# -*- coding: utf-8 -*-
from plone import api
from z3c.form import widget
from z3c.form.browser.textarea import TextAreaWidget
from z3c.form.interfaces import IFieldWidget, IFormLayer
from z3c.form.interfaces import ITextAreaWidget
from zope.component import adapter
from zope.interface import implementer
from zope.interface import implementsOnly
from zope.schema.interfaces import IField
import json


class IEditableMenuSettingsWidget(ITextAreaWidget):
    "Marker Interface"


class EditableMenuSettingsWidget(TextAreaWidget):
    implementsOnly(IEditableMenuSettingsWidget)
    target_field = "textarea"

    @property
    def menu_settings(self):
        support_view = api.content.get_view(
            name='menu_support_view',
            context=self.context,
            request=self.request,
        )
        json_settings = support_view.menu_settings
        if not json_settings:
            return []
        return [(
            key,
            support_view.find_path_title(key),
            value
        ) for key, value in json.loads(json_settings).iteritems()]

    # def render(self):
    #     import pdb
    #     pdb.set_trace()
    #     return super(EditableMenuSettingsWidget, self).render()


@adapter(IField, IFormLayer)
@implementer(IFieldWidget)
def EditableMenuSettingsFieldWidget(field, request):
    "Factory for EditableMenuSettingsWidget."
    return widget.FieldWidget(field, EditableMenuSettingsWidget(request))
