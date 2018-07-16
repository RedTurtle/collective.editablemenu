# ============================================================================
# Menu Config ROBOT TESTS
# ============================================================================
#
# Run this robot test stand-alone:
#
#  $ bin/test -s collective.editablemenu -t test_menu_config.robot --all
#
# Run this robot test with robot server (which is faster):
#
# 1) Start robot server:
#
# $ bin/robot-server --reload-path src collective.editablemenu.testing.COLLECTIVE_EDITABLEMENU_ACCEPTANCE_TESTING
#
# 2) Run robot tests:
#
# $ bin/robot src/collective/editablemenu/tests/robot/test_menu_config.robot
#
# See the http://docs.plone.org for further details (search for robot
# framework).
#
# ============================================================================

*** Settings *****************************************************************

Resource  plone/app/robotframework/selenium.robot
Resource  plone/app/robotframework/keywords.robot
Resource  plone/app/robotframework/saucelabs.robot
Resource  Products/CMFPlone/tests/robot/keywords.robot

Library  Remote  ${PLONE_URL}/RobotRemote

Test Setup  Run keywords  Plone Test Setup
Test Teardown  Run keywords  Plone Test Teardown


*** Variables ****************************************************************

${ADMIN_ROLE}  Site Administrator
${tab1_title}  Tab 1
${tab2_title}  Tab 2
${tab1_submenu_selector}  .submenu-0
${tab2_submenu_selector}  .submenu-1

*** Test Cases ***************************************************************

# Scenario: If menu isn't populated, don't show anything
#   Given I'm logged in as a '${ADMIN_ROLE}'
#    Then I can't see the menu populated

Scenario: As admin i can setup the menu and use it
  Given I'm logged in as a '${ADMIN_ROLE}'
    and Populate site
    and Go to configure panel
   When I add a new menu configuration
   Then I can see new menu tabs
   When I click on tab   ${tab1_title}
   Then First submenu should open and the other should not be visible
    and First submenu should show sections
    and Close menu
  When I click on tab   ${tab2_title}
  Then Second submenu should show documents text

*** Keywords *****************************************************************

Page should contain tab
  [Arguments]  ${tabTitle}
  Page should contain  ${tabTitle}

I click on tab
  [Arguments]  ${tabTitle}
  Click Link   ${tabTitle}

# --- Given ------------------------------------------------------------------

Populate site
  Create content  type=Folder
    ...  id=folder
    ...  title=An example folder
  Create content  type=Document
    ...  container=/${PLONE_SITE_ID}/folder
    ...  id=document-1
    ...  title=First document
    ...  text=Text for first document
  Create content  type=Document
    ...  container=/${PLONE_SITE_ID}/folder
    ...  id=document-2
    ...  title=Second document
    ...  text=Text for second document

I'm logged in as a '${ROLE}'
     Enable autologin as  ${ROLE}
     Go to  ${PLONE_URL}
     Wait until page contains  Plone site

a site homepage
  Go To  ${PLONE_URL}

Go to configure panel
  Go To  ${PLONE_URL}/@@editable-menu-settings
  Wait until page contains  Add item

a login form
  Go To  ${PLONE_URL}/login_form
  Wait until page contains  Login Name
  Wait until page contains  Password


# --- WHEN -------------------------------------------------------------------

I enter valid credentials
  Input Text  __ac_name  admin
  Input Text  __ac_password  secret
  Click Button  Log in

I add a new menu configuration
  Click Button  Add item
  Wait until page contains  New
  Click Link   New
  Wait until page contains  Tab title
  Input Text  css=textarea[name='tabtitle-plone-site-0']  ${tab1_title}
  Input Text  css=input[name='navfolder-plone-site-0']  /folder
  Click Button   Add item
  Wait until page contains  New
  Click Link   New
  Wait until page contains  Tab title
  Input Text  css=textarea[name='tabtitle-plone-site-1']  ${tab2_title}
  Input Text  css=input[name='additional-plone-site-1']  /folder
  Click Button  Save

# --- THEN -------------------------------------------------------------------

I can't see the menu tabs
  Wait until page contains  Plone site
  Page should not contain  css=div#portal-globalnav

I can see new menu tabs
  Go To  ${PLONE_URL}
  Wait until page contains  Plone site
  Page should contain element  css=#portal-globalnav
  Page should contain tab  ${tab1_title}
  Page should contain tab  ${tab2_title}

First submenu should open and the other should not be visible
  Wait until page contains element  css=${tab1_submenu_selector}
  Page should contain element  css=${tab1_submenu_selector}
  Page should not contain element  css=${tab2_submenu_selector}

First submenu should show sections
  Page should contain  In this section
  Page should contain  First document
  Page should contain  Second document
  Page should contain  Explore all the contents of this section
  Page should not contain  Text for first document
  Page should not contain  Text for second document

Second submenu should show documents text
  Page should contain  Text for first document
  Page should contain  Text for second document

Close menu
  Click Link  Close
  Sleep  2 sec
