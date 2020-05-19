/**
 * @fileoverview Class definition for Dashboard Slider gadget
 * @author Ryan Thibodeaux
 * @version 1.1.0
 */

/*
 * Copyright (c) 2016-2018, OctoInsight Inc., All rights reserved.
 * Authored by Ryan Thibodeaux
 * see included LICENSE file (BSD 3-clause)
 */

/*
 * This file creates the slider gadget that appears on the
 * bottom of the dashboard. The slider is toggled up and
 * down by clicking the header.
 * Inside the slider is a checkbox group and a submit button.
 * The checkbox group toggles two tokens: "show_debug"
 * and "hide_inputs". The "show_debug" token is used to
 * control the visibility of the token debugger element.
 * The "hide_inputs" token setting will hide all <fieldset>
 * elements in the dashboard, i.e., all input areas in panels
 * atop the dashboard. A dashboard developer is also free
 * to use either token to control the visibility of other
 * elements using the "depends" and "rejects" settings in
 * Splunk SimpleXML.
 */

(function() {
  require([
    "jquery",
    "underscore",
    "backbone",
    "splunkjs/mvc",
    "splunkjs/mvc/checkboxgroupview",
    "css!/static/app/global_monitoring_console/components/dashboardslider/dashboardslider.css",
    "splunkjs/mvc/simplexml/ready!"
  ], function($, _, Backbone, mvc, CheckboxGroupView) {

    const ENABLE_DEBUG_TOKEN = "show_debug";   // token name for enable debug setting
    const HIDE_INPUTS_TOKEN  = "hide_inputs";  // token name for input hiding setting
    var toggledInputContainers = undefined;

    // handle checkbox token changes
    function checkboxbHandler(value) {
      var defaultTokenModel = mvc.Components.get('default');
      var submittedTokenModel = mvc.Components.get('submitted');
      var debugEnabled = (typeof submittedTokenModel.get(ENABLE_DEBUG_TOKEN) === 'undefined' ? false : true);
      var hideEnabled  = (typeof submittedTokenModel.get(HIDE_INPUTS_TOKEN) === 'undefined' ? false : true);

      // toggle debug token based on checkbox state
      if (value.indexOf('debug') >= 0) { // debug checkbox is checked
        if (!debugEnabled) {
          defaultTokenModel.set(ENABLE_DEBUG_TOKEN, "true");
          submittedTokenModel.set(ENABLE_DEBUG_TOKEN, "true");
        }
      } else { // debug checkbox is not checked
        if (debugEnabled) {
          defaultTokenModel.set(ENABLE_DEBUG_TOKEN, undefined);
          submittedTokenModel.set(ENABLE_DEBUG_TOKEN, undefined);
        }
      }

      // toggle visibility of inputs based on checkbox state
      if (value.indexOf('hideinputs') >= 0) { // hide inputs checkbox is checked
        if (!hideEnabled) {
          defaultTokenModel.set(HIDE_INPUTS_TOKEN, "true");
          submittedTokenModel.set(HIDE_INPUTS_TOKEN, "true");
          toggledInputContainers = $('.fieldset:visible');
          if (toggledInputContainers.length) {
            toggledInputContainers.hide();
          }
        }
      } else { // hide inputs checkbox is not checked
        if (hideEnabled) {
          defaultTokenModel.set(HIDE_INPUTS_TOKEN, undefined);
          submittedTokenModel.set(HIDE_INPUTS_TOKEN, undefined);
          if (toggledInputContainers.length) {
            toggledInputContainers.show();
            toggledInputContainers = undefined;
          }
        }
      }
    }

    // Backbone class definition for slider
    var DashboardSlider = Backbone.View.extend({
      className: "db-slider",
      id: "dashboardSlider",
      animateSpeed: 700,
      title: "GMC",

      // setup the slider div
      initialize: function(options) {
        this.options = options;
        this.template = _.template(this.template);

        (this.render()).$el.insertAfter($('.dashboard-body'));

        // add checkbox for debug and hide inputs options
        var cb = new CheckboxGroupView({
          "id": "db-slider-checkbox",
          "value": "$db-slider-checkbox$",
          "default": "",
          "searchWhenChanged": false,
          "el": $("#db-slider-checkbox")
        }).render();

        // setup checkbox choices
        cb.settings.set("choices", [
          { label: "Enable Debug", value: "debug" },
          { label: "Hide Inputs", value: "hideinputs" }
        ]);

        // listen for toggles to the checkbox options
        cb.on("change", function(value) {
          checkboxbHandler(value);
        });

        cb.$('.splunk-choice-input-message').hide();

        return this;
      },

      // setup listeners to toggle the slider and apply submit button
      events: {
        'click .db-slider-header' : 'toggle',
        'click #db-slider-submit' : function() {
          var defaultTokenModel = mvc.Components.get('default');
          var submittedTokenModel = mvc.Components.get('submitted');
          submittedTokenModel.set(defaultTokenModel.toJSON());
        }
      },

      // apply html template
      render: function() {
        if (this.$el.is(':empty')) {
          this.$el.html(this.template({
            id: this.id,
            title: this.title
          }));
        }
        return this;
      },

      // toggle the slider state
      toggle: function() {
        var p = this.$el.find(".db-slider-container");
        if (p.hasClass('db-slider-up')) {
          p.addClass('db-slider-down', this.animateSpeed);
          p.removeClass('db-slider-up');
          p.find("#db-slider-arrow").removeClass('downarrow').addClass('uparrow');
        } else {
          p.removeClass('db-slider-down');
          p.addClass('db-slider-up', this.animateSpeed);
          p.find("#db-slider-arrow").removeClass('uparrow').addClass('downarrow');
        }
      },

      // html template
      template: '<div id="<%- id %>" class="db-slider-container db-slider-down">' +
                  '<div class="db-slider-header">' +
                    '<span id="db-slider-arrow" class="uparrow">&nbsp;</span>' +
                      '<%- title %>' +
                  '</div>' +
                  '<div class="db-slider-content">' +
                    '<div id="db-slider-checkbox" style="width: auto;"></div>' +
                    '<button class="btn-app-submit" id="db-slider-submit"><span>Submit</span></button>' +
                  '</div>' +
                '</div>'
    });

    /////////////////////////////////////////
    ///  Start Main Code Here
    /////////////////////////////////////////

    // only allow one instance of slider
    if (!$("#dashboardSlider").length) {
      var dashboardslider = new DashboardSlider();
    }
  });
}).call(this);
