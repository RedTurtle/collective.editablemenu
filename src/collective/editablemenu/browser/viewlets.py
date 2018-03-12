# -*- coding: utf-8 -*-
from plone.app.layout.viewlets import common
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile


class CustomGlobalSectionsViewlet(common.GlobalSectionsViewlet):
    """
    """
    index = ViewPageTemplateFile('templates/custom_sections.pt')

    @property
    def menu_tabs(self):
        context = self.context.aq_inner
        support_view = context.restrictedTraverse('@@menu_support_view', None)
        if not support_view:
            return []
        return support_view.get_menu_tabs()
