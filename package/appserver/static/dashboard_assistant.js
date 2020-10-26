require.config({
    paths: {
        "app": "../app"
    }
});
require([
    "views/dashboard/layout/Panel",
    "splunkjs/mvc",
    "splunkjs/mvc/utils",
    "underscore",
    "jquery",
    "splunkjs/mvc/simplexml/ready!"
], function (
    Panel,
    mvc,
    utils,
    _,
    $
) {

    var DashboardPanel = require('views/dashboard/layout/Panel');

    // Generate description entry
    descEl = $(".description");
    if (descEl.html() != "") {
        descEl.append("<br />");
    }
    descEl.css('display', 'block');

    // Properties
    var app = utils.getCurrentApp();
    var view = utils.getPageInfo().page;
    var owner = 'unknown';

    // Get owner details
    uri = Splunk.util.make_url("/splunkd/__raw/servicesNS/-/" + app + "/data/ui/views/" + view + "?output_mode=json");
    $.get(uri, function (data) {
        owner = data["entry"][0]["acl"]["owner"];

        // Get user list
        var url = Splunk.util.make_url('/splunkd/__raw//services/admin/users/' + owner + '?output_mode=json');
        $.get(url, function (data) {
            realname = data["entry"][0]["content"]["realname"];
            email = data["entry"][0]["content"]["email"];
            if (realname != "" && email != "") {
                descEl.append('<div style="width: 50%"><div style="width: 30%; float: left"><b>Owner:</b></div><div><a href="mailto:' + email + '?subject=Splunk%20Dashboard%3A%20' + view + '%20in%20app%20' + app + '">' + realname + ' (' + owner + ')</a></div></div>');
            } else if (realname != "" && email == "") {
                descEl.append('<div style="width: 50%"><div style="width: 30%; float: left"><b>Owner:</b></div><div>' + realname + ' (' + owner + ')</div></div>');
            } else if (email != "" && realname == "") {
                descEl.append('<div style="width: 50%"><div style="width: 30%; float: left"><b>Owner:</b></div><div><a href="mailto:' + email + '?subject=Splunk%20Dashboard%3A%20' + view + '%20in%20app%20' + app + '">' + owner + '</a></div></div>');
            } else {
                descEl.append('<div style="width: 50%"><div style="width: 30%; float: left"><b>Owner:</b></div><div>' + owner + '</div></div>');
            }
        }).fail(function () {
            descEl.append('<div style="width: 50%"><div style="width: 30%; float: left"><b>Owner:</b></div><div>' + owner + '</div></div>');
        });


    });


    // Modal helper
    function createModal(panel, title, message) {
        var edit_panel = '' +
            '<div class="custom-modal modal modal-wide hide fade" id="' + panel + '">' +
            '    <div class="modal-content">' +
            '      <div class="modal-header">' +
            '        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
            '        <h4 class="modal-title" id="exampleModalLabel">' + title + '</h4>' +
            '      </div>' +
            '      <div class="modal-body modal-body-scrolling">' +
            '        ' + message +
            '      </div>' +
            '      <div class="modal-footer">' +
            '        <button class="btn" data-dismiss="modal">Close</button>' +
            '      </div>' +
            '    </div>' +
            '</div>';
        $('body').prepend(edit_panel);
        return true;
    }

    // Get help entries
    uri = Splunk.util.make_url("/splunkd/__raw/servicesNS/-/system/apps/local/" + app + "?output_mode=json");
    $.get(uri, function (data) {
        var app_version = data["entry"][0]["content"]["version"];
        var help_entries = false;
        query = encodeURIComponent('{"app": "' + app + '", "view": "' + view + '", "disabled": false, "$or": [{ "app_version": "any"}, { "app_version": "' + app_version + '" }] }');
        uri = Splunk.util.make_url("/splunkd/__raw/servicesNS/nobody/global_monitoring_console/storage/collections/data/help_entries?query=" + query + "&output_mode=json");

        jQuery.ajax({
            url: uri,
            type: 'GET',
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 403) {
                    alert("You do not have permission to read help entries.");
                }
                else {
                    alert("Unknown error: \n\n" + errorThrown);
                }
            },
            success: function (results) {
                help_entries = results;
                console.debug("results", results);
                // Add modal to each panel in current view
                splunk_components = mvc.Components.toJSON();
                console.log("Components", splunk_components);

                _(splunk_components).chain().filter(function (el) {
                    return el instanceof DashboardPanel;
                }).each(function (panel) {
                    var headerEl = $(panel.el).find(".panel-title");

                    headerEl.css('padding-right', '9px')

                    var panel_help_entry = _.filter(help_entries, function (item) { return item.panel == panel.id });
                    var editorUrl = Splunk.util.make_url('/app/global_monitoring_console/help_entry_editor');
                    var message = '<i>For this panel (ID: ' + panel.id + ') doesn\'t exist any active help entry matching the app version ' + app_version + '.</i><br /><a href="' + editorUrl + '">Manage Help Entries</a></i>';
                    if (panel_help_entry.length > 0) {
                        message = panel_help_entry[0].text;
                    }

                    var title = headerEl.html();
                    createModal(panel.id, title, message);

                    if (panel_help_entry.length > 0 && panel_help_entry[0].classification != "") {
                        headerEl.append('<div style="float: right"><span class="classification-' + panel_help_entry[0].classification + '" style="margin-right: 6px">' + panel_help_entry[0].classification + '</span> <a data-toggle="modal" href="#' + panel.id + '" class="icon-info" style="text-decoration: none"> </a></div>');
                    } else {
                        headerEl.append('<div style="float: right"><a data-toggle="modal" href="#' + panel.id + '" class="icon-info" style="text-decoration: none"> </a></div>');
                    }


                });

                // Update view description
                var view_help_entry = _.filter(help_entries, function (item) { return item.panel == view });
                if (view_help_entry.length > 0) {
                    descEl.append('<div style="width: 50%"><div style="width: 30%; float: left"><b>Classification:</b></div><div><span class="classification-' + view_help_entry[0].classification + '">' + view_help_entry[0].classification + '</span></div></div>');
                    if (view_help_entry[0].text != "") {
                        descEl.append('<div style="width: 50%"><div style="width: 30%; float: left"><b>Info:</b></div><div style="display: table-cell;">' + view_help_entry[0].text + '</div></div>');
                    }
                }


            }.bind(this)
        });
    });

});    