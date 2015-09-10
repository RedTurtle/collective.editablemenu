    # -*- coding: utf-8 -*-
from datetime import date
from collective.z3cform.datetimewidget.interfaces import IDateWidget
from collective.z3cform.datetimewidget.widget_date import DateWidget
from plone.app.textfield.widget import RichTextWidget
from plone.app.textfield.widget import IRichTextWidget
from ubigreen.contenttypes import _
from z3c.form import interfaces as z3cFormInterfaces
from z3c.form import widget
from z3c.form.browser.select import TextWidget
from z3c.form.browser.textlines import TextLinesWidget
from z3c.form.browser.textarea import TextAreaWidget
from z3c.form.interfaces import IFieldWidget, IFormLayer
from zope.component import adapter
from zope.i18n import translate
from zope.interface import implementer
from zope.interface import implementsOnly
from zope.interface import Interface
from zope.schema.interfaces import IField
from zope.i18n.format import DateTimeParseError
from z3c.form.interfaces import NOVALUE
from plone import api


class IIgrantBaseWidget(Interface):

    """Marker interface
    """


class IgrantBaseWidget(object):

    igrant_template = """
<div class="inputIGWrapper">
    %(input)s
</div>
<div class="igrantValueWrapper copyFieldWrapper"
     data-targetField="%(target_field)s">
  <div><strong>%(label)s</strong></div>
  <div class="igrantValue" data-value="%(orig_value)s">%(formatted_value)s</div>
</div>
"""
    target_field = "input"

    @property
    def igrant_value(self):
        igrant_data = getattr(self.context, 'igrant_data', {})
        if not igrant_data:
            return u""
        value = igrant_data.get(self.__name__, '')
        # if isinstance(value, (int, float, Decimal)):
        #     return locale.format("%.2f", value, True)
        return value

    def render_display(self):
        igrant_value = self.igrant_value
        if isinstance(igrant_value, date):
            igrant_value = igrant_value.strftime('%Y-%m-%d')
        self.value = getattr(self.context, self.__name__) or igrant_value
        if isinstance(self.value, int):
            self.value = "{:,} â‚¬".format(self.value).replace(",", ".")
        return super(IgrantBaseWidget, self).render()

    def render_input(self):
        igrant_value = self.igrant_value
        formatted_value = igrant_value
        if isinstance(formatted_value, int):
            formatted_value = u"{:,} â‚¬".format(formatted_value).replace(",", ".")
        rendered = super(IgrantBaseWidget, self).render()
        if igrant_value:
            rendered = self.igrant_template % {
                'label': translate(
                    _(
                        'igrant_value_label',
                        u'Dato a disposizione di Fondazione Cariplo'
                    ),
                    context=self.request),
                'formatted_value': formatted_value,
                'orig_value': igrant_value,
                'input': rendered,
                'target_field': self.target_field
            }
        return rendered

    def render(self):
        if self.mode == 'display':
            return self.render_display()
        elif self.mode == 'input':
            return self.render_input()
        return super(IgrantBaseWidget, self).render()


class ITreeWidget(z3cFormInterfaces.ISelectWidget):

    """Marker interface
    """


class IgrantTextLineWidget(IgrantBaseWidget, TextWidget):

    """"""

    implementsOnly(IIgrantTextLineWidget)

    target_field = "input"

    def render(self):
        igrant_value = self.igrant_value
        if igrant_value:
            if isinstance(igrant_value, str):
                igrant_value = igrant_value.decode('utf-8')
            # self.placeholder = igrant_value
        return super(IgrantTextLineWidget, self).render()


@adapter(IField, IFormLayer)
@implementer(IFieldWidget)
def IgrantTextLineFieldWidget(field, request):
    """factory for IgrantTexLineFieldWidget."""
    return widget.FieldWidget(field, IgrantTextLineWidget(request))


class IIgrantTextAreaWidget(
        IIgrantBaseWidget,
        z3cFormInterfaces.ITextAreaWidget):

    """Marker interface
    """


class IgrantTextAreaWidget(IgrantBaseWidget, TextAreaWidget):

    """"""

    implementsOnly(IIgrantTextAreaWidget)

    target_field = "textarea"

#     igrant_template = """
# <div class="igrantValueWrapperText copyFieldWrapper discreet">
#   <strong>%(label)s</strong>
#   <span class="igrantValue">%(value)s</span>
# </div>
# %(input)s
# """

    def render(self):
        return super(IgrantTextAreaWidget, self).render()


@adapter(IField, IFormLayer)
@implementer(IFieldWidget)
def IgrantTextAreaFieldWidget(field, request):
    """factory for IgrantTextAreaFieldWidget."""
    return widget.FieldWidget(field, IgrantTextAreaWidget(request))


class IIgrantRichTextWidget(
        IIgrantBaseWidget,
        IRichTextWidget):

    """Marker interface
    """


class IgrantRichTextWidget(IgrantBaseWidget, RichTextWidget):

    """"""

    implementsOnly(IIgrantRichTextWidget)
    target_field = "iframe"
#     igrant_template = """
# <div class="igrantValueWrapperText copyFieldWrapper discreet">
#   <strong>%(label)s</strong>
#   <span class="igrantValue">%(value)s</span>
# </div>
# %(input)s
# """

    def render(self):
        return super(IgrantRichTextWidget, self).render()


@adapter(IField, IFormLayer)
@implementer(IFieldWidget)
def IgrantRichTextFieldWidget(field, request):
    """factory for IgrantRichTextFieldWidget."""
    return widget.FieldWidget(field, IgrantRichTextWidget(request))


class IIgrantTextLinesWidget(
        IIgrantBaseWidget,
        z3cFormInterfaces.ITextLinesWidget):

    """Marker interface
    """


class IgrantTextLinesWidget(IgrantBaseWidget, TextLinesWidget):

    """"""

    implementsOnly(IIgrantTextLinesWidget)
    target_field = "textarea"

    igrant_template = """
<div class="inputIGWrapper">
    %(input)s
</div>
<div class="igrantValueWrapper copyFieldWrapper"
     data-targetField="%(target_field)s">
  <div><strong>%(label)s</strong></div>
  <div class="igrantValue igrantValuesList">%(value)s</div>
</div>
"""

    def render(self):
        # self.placeholder = self.igrant_value
        return super(IgrantTextLinesWidget, self).render()

    def render_input(self):
        igrant_value = self.igrant_value
        rendered = super(IgrantBaseWidget, self).render()
        if igrant_value:
            li_list = [
                u'<span class="igrantListItem">%s</span>' %
                x for x in igrant_value]
            rendered = self.igrant_template % {
                'label': translate(_('igrant_value_label', u'Dato a disposizione di Fondazione Cariplo'),
                                   context=self.request),
                'value': u"".join(li_list),
                'input': rendered,
                'target_field': self.target_field
            }
        return rendered


@adapter(IField, IFormLayer)
@implementer(IFieldWidget)
def IgrantTextLinesFieldWidget(field, request):
    """factory for IgrantTextAreaFieldWidget."""
    return widget.FieldWidget(field, IgrantTextLinesWidget(request))


class IIgrantDateWidget(IIgrantBaseWidget, IDateWidget):

    """Marker interface
    """


class IgrantDateWidget(IgrantBaseWidget, DateWidget):

    """"""

    implementsOnly(IIgrantDateWidget)

    def extract(self, default=NOVALUE):
        # get normal input fields
        day = self.request.get(self.name + '-day', default)
        month = self.request.get(self.name + '-month', default)
        year = self.request.get(self.name + '-year', default)

        if not default in (year, month, day):
            return (year, month, day)

        # get a hidden value
        formatter = self.request.locale.dates.getFormatter("date", "short")
        hidden_date = self.request.get(self.name, '')
        if hidden_date:
            #il formatter vuole l'anno con due cifre
            split_date = hidden_date.split("/")
            split_date[2] = split_date[2][2:]
            hidden_date = "/".join(split_date)
        try:
            dateobj = formatter.parse(hidden_date)
            return (str(dateobj.year),
                    str(dateobj.month),
                    str(dateobj.day))
        except DateTimeParseError:
            pass

        return default

    @property
    def formatted_value(self):
        try:
            date_value = date(*map(int, self.value))
        except ValueError:
            return ''
        formatter = self.request.locale.dates.getFormatter("date", "short")
        if date_value.year > 1900:
            date_str = formatter.format(date_value)
            split_date = date_str.split("/")
            split_date[2] = str(date_value.year)
            return "/".join(split_date)
        # due to fantastic datetime.strftime we need this hack
        # for now ctime is default
        return date_value.ctime()

    def show_jquerytools_dateinput_js(self):
        language = getattr(self.request, 'LANGUAGE', 'en')
        calendar = self.request.locale.dates.calendars[self.calendar_type]
        localize =  'jQuery.tools.dateinput.localize("' + language + '", {'
        localize += 'months: "%s",' % ','.join(calendar.getMonthNames())
        localize += 'shortMonths: "%s",' % ','.join(calendar.getMonthAbbreviations())
        # calendar tool's number of days is off by one from jquery tools'
        localize += 'days: "%s",' % ','.join(
            [calendar.getDayNames()[6]] + calendar.getDayNames()[:6])
        localize += 'shortDays: "%s"' % ','.join(
            [calendar.getDayAbbreviations()[6]] +
            calendar.getDayAbbreviations()[:6])
        localize += '});'

        config = 'lang: "%s", ' % language

        value_date = self.value[:3]
        if '' not in value_date:
            config += 'value: new Date("%s/%s/%s"), ' % (value_date)

        config += 'change: function() { ' \
                    'var value = this.getValue("dd/mm/yyyy"); \n' \
                    'jQuery("#%(id)s").val(value); \n' \
                '}, ' % dict(id = self.id)
        config += 'firstDay: %s,' % (calendar.week['firstDay'] % 7)
        # config += 'format: "dd/mm/yyyy",'
        config += self.jquerytools_dateinput_config
        config += self.yearRange

        return '''
            <input type="hidden" name="%(name)s-calendar"
                   id="%(id)s-calendar" />
            <script type="text/javascript">
                jQuery(document).ready(function() {
                    if (jQuery().dateinput) {
                        %(localize)s
                        jQuery("#%(id)s-calendar").dateinput({%(config)s}).unbind('change')
                            .bind('onShow', function (event) {
                                var trigger_offset = jQuery(this).next().offset();
                                jQuery(this).data('dateinput').getCalendar().offset(
                                    {top: trigger_offset.top-100, left: trigger_offset.left+50}
                                );
                            });
                    }
                });
            </script>''' % dict(
                id=self.id, name=self.name,
                config=config, language=language, localize=localize,
            )

    @property
    def igrant_value(self):
        igrant_data = getattr(self.context, 'igrant_data', {})
        if not igrant_data:
            return u""
        value = igrant_data.get(self.__name__, '')
        return api.portal.get_localized_time(datetime=value)


@adapter(IField, IFormLayer)
@implementer(IFieldWidget)
def IgrantDateFieldWidget(field, request):
    """factory for IgrantDateWidget."""
    return widget.FieldWidget(field, IgrantDateWidget(request))
