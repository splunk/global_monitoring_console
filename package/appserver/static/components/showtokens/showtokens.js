// Modified version of Splunk Dashboard Examples app's
// file showtokens.js (see https://splunkbase.splunk.com/app/1603)
//
// Edited by: Ryan Thibodeaux
//   - updated definition to toggle
//     visibility of token viewer
//     and its listening for token
//     changes
//
//
// Token debugger class that will display token
// debug table at the bottom of a dashboard.
// The debugger is controlled by the token "show_debug".


(function() {
  require([
    "jquery",
    "underscore",
    "backbone",
    "splunkjs/mvc",
    "css!/static/app/splunk_global_monitoring_console/components/showtokens/showtokens.css",
    "splunkjs/mvc/simplexml/ready!"
  ], function($, _, Backbone, mvc) {

    // set models to listen to
    var defaultTokenModel = mvc.Components.get('default');
    var submittedTokenModel = mvc.Components.get('submitted');
    var urlTokenModel = mvc.Components.get('url');
    var models = [defaultTokenModel, submittedTokenModel, urlTokenModel];

    // create debug view class
    var TokenDebugView = Backbone.View.extend({
      className: 'show-tokens',
      initialize: function() {
        this.model = new Backbone.Model({
          includeFormTokens: false
        });
        if ('localStorage' in window && window.localStorage) {
          try {
            var STORAGE_KEY = 'splunk-show-tokens';
            var localSettings = window.localStorage.getItem(STORAGE_KEY);
            if (localSettings) {
              this.model.set(JSON.parse(localSettings));
            }
            this.model.on('change', function(model) {
              try {
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(model.toJSON()));
              } catch (e) {}
            });
          } catch (e) {}
        }
      },
      events: {
        'click .checkbox a': function(e) {
          e.preventDefault();
          this.model.set('includeFormTokens', !this.model.get('includeFormTokens'));
        }
      },
      render: function() {
        this.$el.addClass('show-tokens');
        if (this.$el.is(':empty')) {
          this.$el.html(this.template);
        }
        var includeFormTokens = this.model.get('includeFormTokens');
        this.$('.checkbox>a>i')[includeFormTokens ? 'show' : 'hide']();
        var tbody = this.$('tbody');
        tbody.empty();
        var keys = _.union.apply(_, _(models).invoke('keys'));
        if (!includeFormTokens) {
          keys = _(keys).filter(function(k) {
            return k.indexOf('form.') !== 0;
          });
        }
        keys.sort();
        _(keys).each(function(token) {
          var tr = $('<tr></tr>');
          $('<td class="token-name"></td>').text('$' + token + '$').appendTo(tr);
          _(models).each(function(ns) {
            var td = $('<td class="token-value"></td>').appendTo(tr);
            var val = ns.get(token);
            if (val === undefined) {
              td.addClass('undefined').text('undefined');
            } else {
              if (_.isString(val)) {
                td.text(val);
              } else {
                $('<code title="Non-string value"></code>').text(JSON.stringify(val)).appendTo(td);
              }
            }
          });
          tr.appendTo(tbody);
        });
        return this;
      },
      toggleVisibility: function(enable) {
        if (this.$el.length) {
          if (!!enable) {
            this.$el.show();
          } else {
            this.$el.hide();
          }
        }
      },
      toggleListening: function(enable) {
        if (!!enable) {
          this.listenTo(this.model, 'change', this.render);
          this.listenTo(defaultTokenModel, 'change', this.render);
          this.listenTo(submittedTokenModel, 'change', this.render);
          this.listenTo(urlTokenModel, 'change', this.render);
        } else {
          this.stopListening(this.model);
          this.stopListening(defaultTokenModel);
          this.stopListening(submittedTokenModel);
          this.stopListening(urlTokenModel);
        }
      },
      enableTokenVisibility: function(value) {
        if (typeof value !== 'undefined' && value.toString().length > 0) {
          tokenDebug.toggleListening(true);
          tokenDebug.toggleVisibility(true);
          return true;
        } else {
          tokenDebug.toggleListening(false);
          tokenDebug.toggleVisibility(false);
          return false;
        }
      },
      template: '<div class="form-switch">' +
        '<label class="checkbox">' +
        '<a href="#" class="btn"><i class="icon-check" style="display:none"></i></a>' +
        ' Show <code>form.</code> tokens' +
        '</label>' +
        '</div>' +
        '<h3>Token Debug Info</h3>' +
        '<table class="table table-striped table-chrome table-hover">' +
        '<thead>' +
        '<tr>' +
        '   <th>Token</th>' +
        '   <th>Default</th>' +
        '   <th>Submitted</th>' +
        '   <th>URL</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody></tbody>' +
        '</table>'
    });

    /////////////////////////////////////////
    ///  Start Main Code Here
    /////////////////////////////////////////

    // only allow one instance of show-tokens element
    var tokenDebugHtml = $('#show-tokens');
    if (!tokenDebugHtml.length) {
      tokenDebugHtml = $('<div id="show-tokens"></div>').insertAfter($('.dashboard-body'));

      var tokenDebug = new TokenDebugView({ el: tokenDebugHtml });

      // set visibility of TokenDebugView based on "show_debug" token
      tokenDebug.enableTokenVisibility(submittedTokenModel.get('show_debug'));
      submittedTokenModel.on("change:show_debug", function(model, value, options) {
        tokenDebug.enableTokenVisibility(value);
      });

      tokenDebug.render();
    }
  });
}).call(this);
