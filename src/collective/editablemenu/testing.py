# -*- coding: utf-8 -*-
from collective.editablemenu.browser.interfaces import IEditableMenuSettings
from plone import api
from plone.app.robotframework.testing import REMOTE_LIBRARY_BUNDLE_FIXTURE
from plone.app.testing import FunctionalTesting
from plone.app.testing import IntegrationTesting
from plone.app.testing import PLONE_FIXTURE
from plone.app.testing import PloneSandboxLayer
from plone.app.testing import applyProfile
from plone.testing import z2

import collective.editablemenu
import json


class CollectiveEditablemenuLayer(PloneSandboxLayer):

    defaultBases = (PLONE_FIXTURE,)

    def setUpZope(self, app, configurationContext):
        self.loadZCML(package=collective.editablemenu)

    def setUpPloneSite(self, portal):
        applyProfile(portal, 'plone.app.contenttypes:default')
        applyProfile(portal, 'collective.editablemenu:default')


class CollectiveEditablemenuRobotLayer(PloneSandboxLayer):

    defaultBases = (PLONE_FIXTURE,)

    def setUpZope(self, app, configurationContext):
        self.loadZCML(package=collective.editablemenu)

    def setUpPloneSite(self, portal):
        applyProfile(portal, 'plone.app.contenttypes:default')
        applyProfile(portal, 'collective.editablemenu:default')
        self.settings = {
            '/': [
                {
                    'navigation_folder': '/folder',
                    'simple_link': '',
                    'tab_title': 'Foo',
                    'additional_columns': '',
                    'condition': 'python: True',
                },
                {
                    'navigation_folder': '',
                    'simple_link': '',
                    'tab_title': 'Bar',
                    'additional_columns': '/folder',
                    'condition': 'python: True',
                },
                {
                    'navigation_folder': '',
                    'simple_link': '',
                    'tab_title': 'Baz',
                    'additional_columns': '',
                    'condition': 'python: True',
                },
            ]
        }
        api.portal.set_registry_record(
            'menu_tabs_json',
            json.dumps(self.settings).decode('utf-8'),
            interface=IEditableMenuSettings,
        )
        api.content.create(
            container=self.portal, type='Folder', id='folder', title='Folder'
        )
        self.document1 = api.content.create(
            container=self.portal['folder'],
            type='Document',
            title='Document 1',
            id='document-1',
            text='Text for document 1',
        )
        self.document2 = api.content.create(
            container=self.portal['folder'],
            type='Document',
            title='Document 2',
            id='document-2',
            text='Text for document 2',
        )


COLLECTIVE_EDITABLEMENU_FIXTURE = CollectiveEditablemenuLayer()


COLLECTIVE_EDITABLEMENU_INTEGRATION_TESTING = IntegrationTesting(
    bases=(COLLECTIVE_EDITABLEMENU_FIXTURE,),
    name='CollectiveEditablemenuLayer:IntegrationTesting',
)


COLLECTIVE_EDITABLEMENU_FUNCTIONAL_TESTING = FunctionalTesting(
    bases=(COLLECTIVE_EDITABLEMENU_FIXTURE,),
    name='CollectiveEditablemenuLayer:FunctionalTesting',
)


COLLECTIVE_EDITABLEMENU_ACCEPTANCE_TESTING = FunctionalTesting(
    bases=(
        COLLECTIVE_EDITABLEMENU_FIXTURE,
        REMOTE_LIBRARY_BUNDLE_FIXTURE,
        z2.ZSERVER_FIXTURE,
    ),
    name='CollectiveEditablemenuLayer:AcceptanceTesting',
)
