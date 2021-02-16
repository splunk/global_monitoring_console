// SPDX-FileCopyrightText: 2020 Splunk Inc (AK Khamis) <akhamis@splunk.com>
// SPDX-License-Identifier: Apache-2.0

/*
 * This file implements the autodiscover function
 * that finds panels in SimpleXML that should
 * be turned into Toggle Panels based on their
 * HTML IDs matching a specific pattern.
 */

(function() {
  require([
    "underscore",
    "jquery",
    "splunkjs/mvc",
    "TogglePanel",
], function(_, $, mvc, TogglePanel) {

    const regex = /_togglepanel/i;
    const regexHide = /_togglepanel_true/i;

    _(mvc.Components.toJSON())
      .chain()
      .filter(function(el) {
        var id = $(el).attr("id");
        var dom = $(el).attr("$el");
        if (typeof id !== "undefined" && typeof dom !== "undefined") {
          if (id.match(regex) !== null && dom.hasClass('dashboard-cell')) {
            return el;
          }
        }
      }).each(function(el) {
        var id = $(el).attr("id");
        var hide = (id.match(regexHide) !== null ? true : false);
        new TogglePanel(id).setup(hide);
      });
  });
}).call(this);
