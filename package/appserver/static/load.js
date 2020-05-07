/**
 * @fileoverview Setup the paths and load the Developer Gadgets components
 * @author Ryan Thibodeaux
 * @version 1.0.0
 */

/*
 * Copyright (c) 2017-2018, Ryan Thibodeaux. All Rights Reserved
 * see included LICENSE file (BSD 3-clause) in the app's root directory
 */

(function() {
  "use strict";

  // configure the RequrieJS paths
  require.config({
    paths: {
      "appBase"     : "../app/splunk_global_monitoring_console",
      "TogglePanel" : "../app/splunk_global_monitoring_console/components/togglepanel/togglepanel",
    }
  });

  require([
    "/static/app/splunk_global_monitoring_console/components/dashboardslider/dashboardslider.js",
    "/static/app/splunk_global_monitoring_console/components/showtokens/showtokens.js"
  ], function() { /* do nothing */ }, function(err) {
    // error callback
    // the error has a list of modules that failed
    var failedId = err.requireModules && err.requireModules[0];
    console.error("Error when loading Developer Gadgets dependencies: ", err);
  });
}).call(this);


// from app/splunk_global_monitoring_console/components/togglepanel/wrapper.js
/*
 * Copyright (c) 2016-2018, OctoInsight Inc., All rights reserved.
 * Authored by Ryan Thibodeaux
 * see included LICENSE file (BSD 3-clause) in the folder components/togglepanel
 */

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

    "use strict";

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

    /*
     * This function sets a token to indicate when this
     * library has been loaded to help improve
     * dashboard UX with timing aware features.
     */
    require([
      "splunkjs/mvc",
      "splunkjs/mvc/simplexml/ready!"
    ], function(mvc) {

      "use strict";

      const GADGET_LOADED_TOKEN = "gadget_lib_loaded";

      // get token models and setup modifier functions
      var defaultTokenModel   = mvc.Components.get('default');
      var submittedTokenModel = mvc.Components.get('submitted');

      defaultTokenModel.set(GADGET_LOADED_TOKEN, " ");
      submittedTokenModel.set(defaultTokenModel.toJSON());
    });
  });
}).call(this);
