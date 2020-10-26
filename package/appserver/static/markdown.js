require([
    "splunkjs/mvc",
    "splunkjs/mvc/utils",
    "jquery",
    'splunk.util',
], function(
        mvc,
        utils,
        $,
        splunkUtil
    ) {
    
    if($("#appname").length > 0) {
        current_app = $('#appname').html();
    } else {
        current_app = utils.getCurrentApp();
    }

    if($("#filepath").length > 0) {
        filepath = $('#filepath').html();
    } else {
        filepath = 'README.md';
    }
    
    var params = {
        appname     : current_app,
        filepath    : filepath
    };
    var url = splunkUtil.make_url('/custom/global_monitoring_console/markdown/read');
    $.ajax( url,
    {
        uri:  url,
        type: 'GET',
        data: params,

        success: function(data, jqXHR, textStatus){
            // Reload the table
            $('#readme').html(data);
            console.debug("success");
        },
        
        // Handle cases where the file could not be found or the user did not have permissions
        complete: function(jqXHR, textStatus){
            console.debug("complete");
        },
        
        error: function(jqXHR,textStatus,errorThrown) {
            console.log("Error");
        } 
    });
});
