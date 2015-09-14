/**
 * Google analytics for Ferropoly
 * Created by kc on 14.09.15.
 */
'use strict';


/**
 * Short for Ferropoly Analytics
 * @constructor
 */
function Fa(code) {
  (function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
      }, i[r].l = 1 * new Date();
    a = s.createElement(o),
      m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
  })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

  ga('create', code, 'auto');
  ga('send', 'pageview');
}

/**
 * Sends an event
 * @param category
 * @param action
 * @param opt_label
 * @param int_value
 */
Fa.prototype.event = function (category, action, opt_label, int_value) {
  try {
    ga('send', 'event', category, action, opt_label, int_value);
  }
  catch(e) {
    console.log('can not send event: ' + e.message);
  }
};

/**
 * Sends an exception
 * @param description
 * @param fatal
 */
Fa.prototype.exception = function (description, fatal) {
  try {
    ga('send', 'exception', description, fatal);
  }
  catch(e) {
    console.log('can not send event: ' + e.message);
  }
};

var fa = new Fa('UA-39538517-4');
