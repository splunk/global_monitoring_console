// SPDX-FileCopyrightText: 2020 Splunk Inc (AK Khamis) <akhamis@splunk.com>
// SPDX-License-Identifier: Apache-2.0 

require([
    'underscore',
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/tableview',
    'splunkjs/mvc/simplexml/ready!'
], function(_, $, mvc, TableView) {
    
    var CustomTooltipRenderer = TableView.BaseCellRenderer.extend({
        canRender: function(cell) {
            return cell.field === 'GMC_Search';
        },
        render: function($td, cell) {
            
            var message = cell.value;
            var tip = cell.value;
            
            if(message.length > 48) { message = message.substring(0,47) + "..." }
            
            $td.html(_.template('<a href="#" data-toggle="tooltip" data-placement="right" title="<%- tip%>"><%- message%></a>', {
                tip: tip,
                message: message
            }));
            
            // This line wires up the Bootstrap tooltip to the cell markup
            $td.children('[data-toggle="tooltip"]').tooltip();
        }
    });
    
    mvc.Components.get('tblToolTip').getVisualization(function(tableView) {
        
        // Register custom cell renderer
        tableView.table.addCellRenderer(new CustomTooltipRenderer());

        // Force the table to re-render
        tableView.table.render();
    });
    
});
