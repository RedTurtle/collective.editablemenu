# -*- coding: utf-8 -*-
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from plone.app.layout.viewlets import common


class CustomGlobalSectionsViewlet(common.GlobalSectionsViewlet):
    """
    """
    index = ViewPageTemplateFile('templates/custom_sections.pt')

    @property
    def menu_tabs(self):
        context = self.context.aq_inner
        support_view = context.restrictedTraverse("@@menu_support_view", None)
        if not support_view:
            return []
        return support_view.get_menu_tabs()
