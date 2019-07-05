Changelog
=========


2.2.0 (2019-07-05)
------------------

- Add python3 support.
  [cekk]


2.1.1 (2019-05-24)
------------------

- Fixed submenu_detail_view.pt so that condition do not call folder object.
  [eikichi18]


2.1.0 (2018-12-20)
------------------

- Don't break the viewlet if the context is not in the structure mapping.
  [cekk]

Breaking:

- Remove unused classes/interfaces for old-style registry entries from code.
  See the README for upgrading informations (only if you came from < 0.10.0).
  [cekk]

2.0.0 (2018-10-11)
------------------

Breaking:

- Rewrote menu templates to improve accessibility
  [pnicolli]
- Handled aria-expanded and ESC keypress event via ES [nzambello]

1.2.0 (unreleased)
------------------

- Remove unused old code
  [cekk]
- Fix menu render when there are no settings for the current folder
  [cekk]
- Add initial test suite (functional and acceptance)
- Add test suite (functional and acceptance)
  [cekk]

1.1.0 (2018-05-15)
------------------

- Added custom events when the menu is opened, closed and loaded
  [pnicolli]


1.0.1 (2018-04-27)
------------------

- Fixed deprecated plone.directives.form import
  [pnicolli]


1.0.0 (2018-03-12)
------------------

- Fix zcml condition for registering the global_sections viewlet. It was adding two different viewlets simultaneously on Plone 5, now one of those is gone.
  [pnicolli]
- plone.protect js script was being added to the submenu html, now it's removed manually from the async response.
  [pnicolli]
- Moved configuration format to using a json string
  [daniele-andreotti]
- Completely new controlpanel layout
  [pnicolli]
- Fix choose_site_menu_config method to take the right path
  [fdelia]


0.10.2 (2017-09-13)
-------------------

- Fix url generation for simple_link field. Now can handle correctly both
  internal or external links.
  [cekk]


0.10.1 (2017-01-23)
-------------------

- Fix upgrade steps [lucabel]


0.10.0 (2017-01-20)
-------------------

- BREAKING: Submenus are now created inside the menu <li> element, instead of after the whole <ul> [pnicolli]


0.9.1 (2016-12-02)
------------------

- Added Dexterity support for the static portion of the menu [pnicolli]
- Page template now loaded inside the class to allow easier viewlet cloning [pnicolli]
- Add simple "not expansible" link in menu [lucabel]
- Add possibility to condition tab visibility the same way portal_tabs did it [lucabel]
- Add Plone5 compatibility (no resourse registry)
  [cekk]


0.9.0 (2016-03-15)
------------------

- Fix MANIFEST.in and trove classifiers in order to release package on PyPI
  [ale-rt]


0.2.1 (2016-01-11)
------------------

- Fix js call [cekk]


0.2.0 (2016-01-11)
------------------

- Fix registry problems [cekk]


0.1.0 (2016-01-05)
------------------

- Initial release.
  [cekk]
