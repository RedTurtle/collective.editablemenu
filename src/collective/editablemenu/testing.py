# -*- coding: utf-8 -*-
from plone.app.robotframework.testing import REMOTE_LIBRARY_BUNDLE_FIXTURE
from plone.app.testing import applyProfile
from plone.app.testing import FunctionalTesting
from plone.app.testing import IntegrationTesting
from plone.app.testing import PLONE_FIXTURE
from plone.app.testing import PloneSandboxLayer
from plone.testing import z2

import collective.editablemenu


class CollectiveEditablemenuLayer(PloneSandboxLayer):

    defaultBases = (PLONE_FIXTURE,)

    def setUpZope(self, app, configurationContext):
        self.loadZCML(package=collective.editablemenu)

    def setUpPloneSite(self, portal):
        applyProfile(portal, 'collective.editablemenu:default')


COLLECTIVE_EDITABLEMENU_FIXTURE = CollectiveEditablemenuLayer()


COLLECTIVE_EDITABLEMENU_INTEGRATION_TESTING = IntegrationTesting(
    bases=(COLLECTIVE_EDITABLEMENU_FIXTURE,),
    name='CollectiveEditablemenuLayer:IntegrationTesting'
)


COLLECTIVE_EDITABLEMENU_FUNCTIONAL_TESTING = FunctionalTesting(
    bases=(COLLECTIVE_EDITABLEMENU_FIXTURE,),
    name='CollectiveEditablemenuLayer:FunctionalTesting'
)


COLLECTIVE_EDITABLEMENU_ACCEPTANCE_TESTING = FunctionalTesting(
    bases=(
        COLLECTIVE_EDITABLEMENU_FIXTURE,
        REMOTE_LIBRARY_BUNDLE_FIXTURE,
        z2.ZSERVER_FIXTURE
    ),
    name='CollectiveEditablemenuLayer:AcceptanceTesting'
)
