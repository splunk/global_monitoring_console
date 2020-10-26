require.config({
    paths: {
        HelpEntryListerView: "../app/global_monitoring_console/views/HelpEntryListerView"
    }
});

require([
         "jquery",
         "underscore",
         "backbone",
         "HelpEntryListerView",
         "splunkjs/mvc/simplexml/ready!"
     ], function($, _, Backbone, HelpEntryListerView)
     {
         var HelpEntryListerView = new HelpEntryListerView({
        	 'el': $("#help_entries"),
        	 'app': 'global_monitoring_console',
        	 'collection' : 'help_entries',
        	 //'editor' : 'suppression_rules_edit',
        	 'allow_editing_collection': true
         });
         
         HelpEntryListerView.render();
     }
);